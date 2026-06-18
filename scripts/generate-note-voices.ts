import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { notes } from '../src/notes.ts'
import type { VoicePersona } from '../src/notes.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const loadEnv = async () => {
  const envPath = path.join(root, '.env')
  if (!existsSync(envPath)) return

  const raw = await readFile(envPath, 'utf8')
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const [key, ...rest] = trimmed.split('=')
    if (!process.env[key]) {
      process.env[key] = rest.join('=').trim()
    }
  }
}

await loadEnv()

const apiKey = process.env.ELEVENLABS_API_KEY
const voiceIds: Record<VoicePersona, string | undefined> = {
  'all-might': process.env.ELEVENLABS_VOICE_ALL_MIGHT,
  vegeta: process.env.ELEVENLABS_VOICE_VEGETA,
  attenborough: process.env.ELEVENLABS_VOICE_ATTENBOROUGH,
}

if (!apiKey) {
  console.error('Missing ELEVENLABS_API_KEY in .env')
  process.exit(1)
}

for (const persona of Object.keys(voiceIds) as VoicePersona[]) {
  if (!voiceIds[persona]) {
    console.error(`Missing voice id for ${persona} in .env`)
    process.exit(1)
  }
}

const generateVoice = async (text: string, voiceId: string) => {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
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
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`ElevenLabs error ${response.status}: ${detail}`)
  }

  return Buffer.from(await response.arrayBuffer())
}

console.log(`Generating ${notes.length} note voice files...`)

for (let index = 0; index < notes.length; index += 1) {
  const note = notes[index]
  const id = String(index + 1).padStart(2, '0')
  const dir = path.join(root, 'public/voices', note.voice)
  const filePath = path.join(dir, `${id}.mp3`)
  const voiceId = voiceIds[note.voice]

  if (!voiceId) continue

  await mkdir(dir, { recursive: true })

  process.stdout.write(`${id} ${note.voice} ... `)
  const audio = await generateVoice(note.text, voiceId)
  await writeFile(filePath, audio)
  process.stdout.write('done\n')

  await new Promise((resolve) => setTimeout(resolve, 350))
}

console.log('All note voices saved to public/voices/')
