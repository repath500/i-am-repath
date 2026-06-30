import { notes } from './notes'

export const NOTE_VOICE_DIR = 'david'

export const getNoteVoiceSrc = (index: number) => {
  if (!notes[index]) return null
  const id = String(index + 1).padStart(2, '0')
  return `/voices/${NOTE_VOICE_DIR}/${id}.mp3`
}

export const getRepathPublicLetterVoiceSrc = (id: string) =>
  id === 'childhood'
    ? `/voices/${NOTE_VOICE_DIR}/letter.mp3`
    : `/voices/${NOTE_VOICE_DIR}/letter-${id}.mp3`

export const findNoteIndex = (text: string) =>
  notes.findIndex((note) => note.text === text)
