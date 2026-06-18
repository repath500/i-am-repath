export const config = { runtime: 'edge' }

const PRESENCE_KEY = 'repath:presence'
const WINDOW_MS = 30_000

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!redisUrl || !redisToken) {
    return Response.json(
      { others: 0, enabled: false },
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
  const cutoff = now - WINDOW_MS

  const response = await fetch(redisUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${redisToken}` },
    body: JSON.stringify([
      ['ZADD', PRESENCE_KEY, now, visitorId],
      ['ZREMRANGEBYSCORE', PRESENCE_KEY, 0, cutoff],
      ['ZCARD', PRESENCE_KEY],
    ]),
  })

  if (!response.ok) {
    return Response.json(
      { others: 0, enabled: false },
      { headers: corsHeaders },
    )
  }

  const data = (await response.json()) as { result?: unknown[] }
  const count = Number(data.result?.[2] ?? 0)
  const others = Math.max(0, count - 1)

  return Response.json(
    { others, enabled: true, id: visitorId },
    { headers: corsHeaders },
  )
}
