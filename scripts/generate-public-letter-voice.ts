import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  getRepathPublicLetterSpeakText,
  repathPublicLetters,
} from '../src/hiddenContent.ts'
import { NOTE_VOICE_DIR } from '../src/voices.ts'

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
const voiceId = process.env.ELEVENLABS_VOICE_DAVID

if (!apiKey) {
  console.error('Missing ELEVENLABS_API_KEY in .env')
  process.exit(1)
}

if (!voiceId) {
  console.error('Missing ELEVENLABS_VOICE_DAVID in .env')
  process.exit(1)
}

const dir = path.join(root, 'public/voices', NOTE_VOICE_DIR)
await mkdir(dir, { recursive: true })

for (const letter of repathPublicLetters) {
  const speakText = getRepathPublicLetterSpeakText(letter)
  const fileName =
    letter.id === 'childhood' ? 'letter.mp3' : `letter-${letter.id}.mp3`

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
        text: speakText,
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
    const detail = await response.text()
    console.error(`ElevenLabs error ${response.status} (${letter.id}): ${detail}`)
    process.exit(1)
  }

  const filePath = path.join(dir, fileName)
  await writeFile(filePath, Buffer.from(await response.arrayBuffer()))
  console.log(`Public letter voice saved to public/voices/${NOTE_VOICE_DIR}/${fileName}`)
}
