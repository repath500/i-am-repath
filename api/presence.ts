import { getRedisConfig, redisPipeline } from '../lib/upstash'

export const config = { runtime: 'edge' }

const PRESENCE_KEY = 'repath:presence'
const MAX_WINDOW_MS = 2 * 60 * 60 * 1000

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const parseRevRange = (result: unknown) => {
  if (!Array.isArray(result)) return []

  const entries: { id: string; seenAt: number }[] = []
  for (let i = 0; i < result.length; i += 2) {
    const id = result[i]
    const seenAt = Number(result[i + 1])
    if (typeof id === 'string' && Number.isFinite(seenAt)) {
      entries.push({ id, seenAt })
    }
  }
  return entries
}

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  const { url: redisUrl, token: redisToken } = getRedisConfig()

  if (!redisUrl || !redisToken) {
    return Response.json(
      { minutesAgo: null, enabled: false },
      { headers: corsHeaders },
    )
  }

  let body: { id?: string } = {}
  try {
    body = await request.json()
  } catch {
    // ignore malformed body
  }

  const visitorId = body.id || crypto.randomUUID()
  const now = Date.now()
  const cutoff = now - MAX_WINDOW_MS

  const data = await redisPipeline([
    ['ZADD', PRESENCE_KEY, now, visitorId],
    ['ZREMRANGEBYSCORE', PRESENCE_KEY, 0, cutoff],
    ['ZREVRANGE', PRESENCE_KEY, 0, 24, 'WITHSCORES'],
  ])

  if (!data) {
    return Response.json(
      { minutesAgo: null, enabled: false },
      { headers: corsHeaders },
    )
  }

  const entries = parseRevRange(data.result?.[2])
  const lastOther = entries.find((entry) => entry.id !== visitorId)

  let minutesAgo: number | null = null
  if (lastOther) {
    const elapsed = Math.max(0, now - lastOther.seenAt)
    minutesAgo = Math.floor(elapsed / 60_000)
    if (minutesAgo > 120) minutesAgo = null
  }

  return Response.json(
    { minutesAgo, enabled: true, id: visitorId },
    { headers: corsHeaders },
  )
}
