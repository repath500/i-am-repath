const PROGRESS_KEY = 'repath:progress:v1'
const NOTE_COUNT = 31

export type ProgressState = {
  notes: number[]
  videos: string[]
  letterRuleSeen?: boolean
  respectShown?: boolean
  repathLetterRead?: boolean
}

const read = (): ProgressState => {
  if (typeof window === 'undefined') {
    return { notes: [], videos: [] }
  }
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY)
    if (!raw) return { notes: [], videos: [] }
    return JSON.parse(raw) as ProgressState
  } catch {
    return { notes: [], videos: [] }
  }
}

const write = (state: ProgressState) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(state))
    window.dispatchEvent(new CustomEvent('repath:progress'))
  } catch {
    // storage unavailable
  }
}

export const getProgress = () => read()

export const markNoteComplete = (index: number) => {
  if (index < 0 || index >= NOTE_COUNT) return
  const state = read()
  if (state.notes.includes(index)) return
  write({ ...state, notes: [...state.notes, index].sort((a, b) => a - b) })
}

export const markVideoComplete = (videoId: string) => {
  const state = read()
  if (state.videos.includes(videoId)) return
  write({ ...state, videos: [...state.videos, videoId] })
}

export const allNotesComplete = () => read().notes.length >= NOTE_COUNT

export const noteCompletionCount = () => read().notes.length

export const markLetterRuleSeen = () => {
  const state = read()
  if (state.letterRuleSeen) return
  write({ ...state, letterRuleSeen: true })
}

export const hasSeenLetterRule = () => read().letterRuleSeen === true

export const markRespectShown = () => {
  const state = read()
  if (state.respectShown) return
  write({ ...state, respectShown: true })
}

export const hasShownRespect = () => read().respectShown === true

export const markRepathLetterRead = () => {
  write({ ...read(), repathLetterRead: true })
}

export const hasReadRepathLetter = () => read().repathLetterRead === true

export const useProgressListener = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {}
  const handler = () => callback()
  window.addEventListener('repath:progress', handler)
  return () => window.removeEventListener('repath:progress', handler)
}
