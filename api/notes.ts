import { getRedisConfig, redisPipeline } from '../lib/upstash'

export const config = { runtime: 'edge' }

const NOTES_KEY = 'repath:visitor-notes'
const MAX_TEXT_LENGTH = 600

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

  const { url, token } = getRedisConfig()
  if (!url || !token) {
    return Response.json(
      { error: 'storage unavailable' },
      { status: 503, headers: corsHeaders },
    )
  }

  let text = ''
  try {
    const body = (await request.json()) as { text?: string }
    text = body.text?.trim() ?? ''
  } catch {
    return Response.json({ error: 'invalid body' }, { status: 400, headers: corsHeaders })
  }

  if (!text) {
    return Response.json({ error: 'empty note' }, { status: 400, headers: corsHeaders })
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return Response.json({ error: 'note too long' }, { status: 400, headers: corsHeaders })
  }

  const entry = JSON.stringify({
    id: crypto.randomUUID(),
    text,
    createdAt: new Date().toISOString(),
  })

  const result = await redisPipeline([
    ['ZADD', NOTES_KEY, Date.now(), entry],
    ['ZREMRANGEBYRANK', NOTES_KEY, 0, -501],
  ])

  if (!result) {
    return Response.json(
      { error: 'save failed' },
      { status: 502, headers: corsHeaders },
    )
  }

  return Response.json({ ok: true }, { headers: corsHeaders })
}
