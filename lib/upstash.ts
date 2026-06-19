export const getRedisConfig = () => {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.UPSTASH_REDIS_REST_KV_REST_API_URL ??
    process.env.KV_REST_API_URL

  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN ??
    process.env.KV_REST_API_TOKEN

  return { url, token }
}

export const redisPipeline = async (commands: unknown[][]) => {
  const { url, token } = getRedisConfig()
  if (!url || !token) return null

  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(commands),
  })

  if (!response.ok) return null
  return (await response.json()) as { result?: unknown[] }
}
