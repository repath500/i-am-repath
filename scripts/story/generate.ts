/**
 * Generates the "night shift" story assets through OpenRouter.
 *
 *   OPENROUTER_API_KEY=sk-or-... npm run story:generate -- [flags]
 *
 * Flags:
 *   --dry              print the plan and estimated image cost, call nothing
 *   --only=a,b         only these asset ids (their refs must already exist)
 *   --kind=image|video only one kind
 *   --stage=refs       only assets whose chapter matches (substring)
 *   --force            regenerate even if the output file exists
 *   --concurrency=N    parallel jobs (default 2)
 *   --audio            let Seedance generate audio for clips marked audio:true
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { assets, IMAGE_MODEL, VIDEO_MODEL, type Asset, type ImageAsset, type VideoAsset } from './manifest'

const API = 'https://openrouter.ai/api/v1'
const OUT = join(process.cwd(), 'public', 'story', 'raw')
const LEDGER = join(process.cwd(), 'scripts', 'story', 'ledger.jsonl')

const IMAGE_PRICE_USD: Record<ImageAsset['resolution'], number> = {
  '768': 0.041,
  '1K': 0.048,
  '1.5K': 0.07,
  '2K': 0.1,
}

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.replace(/^--/, '').split('=')
    return [key, value ?? 'true'] as const
  }),
)

const dry = args.has('dry')
const force = args.has('force')
const withAudio = args.has('audio')
const concurrency = Number(args.get('concurrency') ?? 2)
const only = args.get('only')?.split(',')
const kind = args.get('kind')
const stage = args.get('stage')

const key = process.env.OPENROUTER_API_KEY
if (!key && !dry) {
  console.error('OPENROUTER_API_KEY is not set. Add it to .env or run with --dry.')
  process.exit(1)
}

const headers = {
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
  'HTTP-Referer': 'https://repath.life',
  'X-Title': 'repath.life story assets',
}

const outPath = (asset: Asset) =>
  join(OUT, asset.kind === 'image' ? 'img' : 'video', `${asset.id}.${asset.kind === 'image' ? 'png' : 'mp4'}`)

const imagePath = (id: string) => join(OUT, 'img', `${id}.png`)

const dataUrl = (id: string) => {
  const path = imagePath(id)
  if (!existsSync(path)) throw new Error(`missing reference "${id}" (expected ${path})`)
  return `data:image/png;base64,${readFileSync(path).toString('base64')}`
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const save = (path: string, data: Buffer) => {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, data)
}

const record = (entry: Record<string, unknown>) => {
  appendFileSync(LEDGER, `${JSON.stringify({ at: new Date().toISOString(), ...entry })}\n`)
}

async function withRetry<T>(label: string, run: () => Promise<T>, attempts = 4): Promise<T> {
  let lastError: unknown
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await run()
    } catch (error) {
      lastError = error
      const wait = 4000 * 2 ** (attempt - 1)
      console.warn(`  ! ${label} failed (attempt ${attempt}/${attempts}): ${(error as Error).message}`)
      if (attempt < attempts) await sleep(wait)
    }
  }
  throw lastError
}

async function generateImage(asset: ImageAsset) {
  const body: Record<string, unknown> = {
    model: IMAGE_MODEL,
    prompt: asset.prompt,
    aspect_ratio: asset.aspect,
    resolution: asset.resolution,
    output_format: 'png',
  }
  if (asset.seed !== undefined) body.seed = asset.seed
  if (asset.refs?.length) {
    body.input_references = asset.refs.map((id) => ({ type: 'image_url', image_url: { url: dataUrl(id) } }))
  }

  const response = await fetch(`${API}/images`, { method: 'POST', headers, body: JSON.stringify(body) })
  if (!response.ok) throw new Error(`${response.status} ${await response.text()}`)
  const json = (await response.json()) as {
    data: { b64_json: string }[]
    usage?: { cost?: number }
  }
  const image = json.data?.[0]?.b64_json
  if (!image) throw new Error('no image in response')
  save(outPath(asset), Buffer.from(image, 'base64'))
  record({ id: asset.id, kind: 'image', model: IMAGE_MODEL, cost: json.usage?.cost })
  return json.usage?.cost
}

async function generateVideo(asset: VideoAsset) {
  const frames = [
    asset.firstFrame && { frame_type: 'first_frame', id: asset.firstFrame },
    asset.lastFrame && { frame_type: 'last_frame', id: asset.lastFrame },
  ].filter(Boolean) as { frame_type: string; id: string }[]

  const body: Record<string, unknown> = {
    model: VIDEO_MODEL,
    prompt: asset.prompt,
    duration: asset.duration,
    size: asset.size,
    generate_audio: withAudio && asset.audio,
    frame_images: frames.map((frame) => ({
      type: 'image_url',
      image_url: { url: dataUrl(frame.id) },
      frame_type: frame.frame_type,
    })),
  }
  if (asset.seed !== undefined) body.seed = asset.seed

  const submit = await fetch(`${API}/videos`, { method: 'POST', headers, body: JSON.stringify(body) })
  if (!submit.ok) throw new Error(`${submit.status} ${await submit.text()}`)
  const job = (await submit.json()) as { id: string; polling_url: string }
  console.log(`  … ${asset.id} queued as ${job.id}`)

  const started = Date.now()
  while (Date.now() - started < 20 * 60_000) {
    await sleep(15_000)
    const poll = await fetch(job.polling_url, { headers })
    if (!poll.ok) continue
    const status = (await poll.json()) as {
      status: string
      unsigned_urls?: string[]
      error?: string
      usage?: { cost?: number }
    }
    if (status.status === 'completed' && status.unsigned_urls?.[0]) {
      const file = await fetch(status.unsigned_urls[0], { headers })
      if (!file.ok) throw new Error(`download ${file.status}`)
      save(outPath(asset), Buffer.from(await file.arrayBuffer()))
      record({ id: asset.id, kind: 'video', model: VIDEO_MODEL, job: job.id, cost: status.usage?.cost })
      return status.usage?.cost
    }
    if (['failed', 'cancelled', 'expired'].includes(status.status)) {
      throw new Error(`${status.status}: ${status.error ?? 'unknown error'}`)
    }
  }
  throw new Error(`timed out waiting for ${job.id}`)
}

const dependencies = (asset: Asset) =>
  asset.kind === 'image'
    ? (asset.refs ?? [])
    : ([asset.firstFrame, asset.lastFrame].filter(Boolean) as string[])

function selectAssets() {
  return assets.filter((asset) => {
    if (only && !only.includes(asset.id)) return false
    if (kind && asset.kind !== kind) return false
    if (stage && !asset.chapter.includes(stage)) return false
    return true
  })
}

async function main() {
  const selected = selectAssets()
  const pending = selected.filter((asset) => force || !existsSync(outPath(asset)))
  const images = pending.filter((asset): asset is ImageAsset => asset.kind === 'image')
  const videos = pending.filter((asset): asset is VideoAsset => asset.kind === 'video')
  const imageEstimate = images.reduce((sum, asset) => sum + IMAGE_PRICE_USD[asset.resolution], 0)

  console.log(`story assets: ${selected.length} selected, ${pending.length} to generate`)
  console.log(`  images: ${images.length} (≈ $${imageEstimate.toFixed(2)} on ${IMAGE_MODEL})`)
  console.log(`  videos: ${videos.length} on ${VIDEO_MODEL} (billed per video token; see ledger after run)`)

  if (dry) {
    for (const asset of pending) {
      const deps = dependencies(asset)
      console.log(`  - [${asset.kind}] ${asset.id}${deps.length ? `  ← ${deps.join(', ')}` : ''}`)
    }
    return
  }

  const done = new Set(assets.filter((asset) => existsSync(outPath(asset)) && !force).map((asset) => asset.id))
  const queue = [...pending]
  const failed: string[] = []
  let spent = 0

  // Run in waves so an asset only starts once all of its references exist.
  while (queue.length) {
    const ready = queue.filter((asset) => dependencies(asset).every((id) => done.has(id) || existsSync(imagePath(id))))
    if (!ready.length) {
      console.error(`blocked: ${queue.map((asset) => asset.id).join(', ')} (missing references)`)
      break
    }

    for (let i = 0; i < ready.length; i += concurrency) {
      const batch = ready.slice(i, i + concurrency)
      await Promise.all(
        batch.map(async (asset) => {
          console.log(`→ ${asset.kind} ${asset.id}`)
          try {
            const cost = await withRetry(asset.id, () =>
              asset.kind === 'image' ? generateImage(asset) : generateVideo(asset),
            )
            spent += cost ?? 0
            done.add(asset.id)
            console.log(`✓ ${asset.id}${cost ? ` ($${cost.toFixed(3)})` : ''}`)
          } catch (error) {
            failed.push(asset.id)
            console.error(`✗ ${asset.id}: ${(error as Error).message}`)
          }
        }),
      )
    }

    for (const asset of ready) queue.splice(queue.indexOf(asset), 1)
    for (const id of failed) {
      const blocked = queue.filter((asset) => dependencies(asset).includes(id))
      for (const asset of blocked) {
        queue.splice(queue.indexOf(asset), 1)
        failed.push(asset.id)
        console.error(`✗ ${asset.id}: skipped, depends on failed "${id}"`)
      }
    }
  }

  console.log(`\nspent ≈ $${spent.toFixed(2)} · ${done.size} assets on disk · ${failed.length} failed`)
  if (failed.length) process.exitCode = 1
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
