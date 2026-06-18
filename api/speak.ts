export const config = { runtime: 'edge' }

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const apiKey = process.env.ELEVENLABS_API_KEY
  const voiceId = process.env.ELEVENLABS_VOICE_DAVID

  if (!apiKey || !voiceId) {
    return Response.json({ error: 'tts unavailable' }, { status: 503 })
  }

  let text = ''
  try {
    const body = (await request.json()) as { text?: string }
    text = body.text?.trim() ?? ''
  } catch {
    return Response.json({ error: 'invalid body' }, { status: 400 })
  }

  if (!text || text.length > 1200) {
    return Response.json({ error: 'invalid text' }, { status: 400 })
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.42,
          similarity_boost: 0.8,
          style: 0.35,
        },
      }),
    },
  )

  if (!response.ok) {
    return Response.json({ error: 'generation failed' }, { status: 502 })
  }

  return new Response(await response.arrayBuffer(), {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'private, max-age=3600',
    },
  })
}
