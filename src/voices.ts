import { notes } from './notes'
import type { VoicePersona } from './notes'

export const voiceLabels: Record<VoicePersona, string> = {
  'all-might': 'all might',
  vegeta: 'vegeta',
  attenborough: 'attenborough',
}

export const getNoteVoiceSrc = (index: number) => {
  const note = notes[index]
  if (!note) return null
  const id = String(index + 1).padStart(2, '0')
  return `/voices/${note.voice}/${id}.mp3`
}

export const findNoteIndex = (text: string) =>
  notes.findIndex((note) => note.text === text)
