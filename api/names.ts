import { getRedisConfig, redisPipeline } from '../lib/upstash'

export const config = { runtime: 'edge' }

const NAMES_KEY = 'repath:public-names'
const MAX_NAME_LENGTH = 24

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const { url, token } = getRedisConfig()
  if (!url || !token) {
    return Response.json({ names: [], enabled: false }, { headers: corsHeaders })
  }

  if (request.method === 'GET') {
    const data = await redisPipeline([['ZREVRANGE', NAMES_KEY, 0, 39]])
    if (!data?.result?.[0]) {
      return Response.json({ names: [], enabled: true }, { headers: corsHeaders })
    }

    const raw = data.result[0] as string[]
    const names = raw
      .map((entry) => {
        try {
          return JSON.parse(entry) as { name: string }
        } catch {
          return null
        }
      })
      .filter((entry): entry is { name: string } => Boolean(entry?.name))
      .map((entry) => entry.name)

    return Response.json({ names, enabled: true }, { headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  let body: { name?: string; visible?: boolean; id?: string } = {}
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'invalid body' }, { status: 400, headers: corsHeaders })
  }

  const visitorId = body.id || crypto.randomUUID()
  const visible = body.visible === true
  const name = body.name?.trim().slice(0, MAX_NAME_LENGTH) ?? ''

  if (visible && name.length < 1) {
    return Response.json({ error: 'name required' }, { status: 400, headers: corsHeaders })
  }

  const member = JSON.stringify({ id: visitorId, name })
  const commands: unknown[][] = visible
    ? [['ZADD', NAMES_KEY, Date.now(), member]]
    : [['ZREM', NAMES_KEY, member]]

  const result = await redisPipeline(commands)
  if (!result) {
    return Response.json({ error: 'save failed' }, { status: 502, headers: corsHeaders })
  }

  return Response.json({ ok: true, id: visitorId }, { headers: corsHeaders })
}
