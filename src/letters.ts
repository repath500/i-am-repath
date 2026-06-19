export type SavedLetter = {
  id: string
  text: string
  deliverAt: string
  createdAt: string
  openedAt?: string
  replyTo?: string
  label?: string
}

export const LETTERS_STORAGE_KEY = 'repath:letters:v1'

const startOfDay = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate())

export const loadLetters = (): SavedLetter[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(LETTERS_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SavedLetter[]) : []
  } catch {
    return []
  }
}

export const saveLetters = (letters: SavedLetter[]) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify(letters))
  } catch {
    // storage unavailable
  }
}

export const addLetter = (
  text: string,
  deliverAt: string,
  options?: { replyTo?: string; label?: string },
): SavedLetter => {
  const letter: SavedLetter = {
    id: crypto.randomUUID(),
    text: text.trim(),
    deliverAt,
    createdAt: new Date().toISOString(),
    replyTo: options?.replyTo,
    label: options?.label?.trim() || undefined,
  }
  const letters = loadLetters()
  letters.push(letter)
  saveLetters(letters)
  return letter
}

export const markLetterOpened = (id: string) => {
  const letters = loadLetters().map((letter) =>
    letter.id === id
      ? { ...letter, openedAt: letter.openedAt ?? new Date().toISOString() }
      : letter,
  )
  saveLetters(letters)
}

export const isLetterDue = (letter: SavedLetter, now = new Date()) => {
  const due = startOfDay(new Date(`${letter.deliverAt}T00:00:00`))
  return startOfDay(now).getTime() >= due.getTime()
}

export const getDueLetters = (now = new Date()) =>
  loadLetters().filter((letter) => isLetterDue(letter, now))

export const getUpcomingLetters = (now = new Date()) =>
  loadLetters().filter((letter) => !isLetterDue(letter, now))

export const getLetterThread = (id: string) => {
  const letters = loadLetters()
  const thread: SavedLetter[] = []
  let current = letters.find((letter) => letter.id === id)
  while (current) {
    thread.unshift(current)
    current = current.replyTo
      ? letters.find((letter) => letter.id === current?.replyTo)
      : undefined
  }
  return thread
}

export const formatLetterDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`)
  return date.toLocaleDateString([], {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export const formatWrittenDate = (iso: string) => {
  const date = new Date(iso)
  return date.toLocaleDateString([], {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export const daysSinceWritten = (iso: string, now = new Date()) => {
  const written = startOfDay(new Date(iso))
  const today = startOfDay(now)
  return Math.max(0, Math.floor((today.getTime() - written.getTime()) / 86_400_000))
}

export const daysSinceLabel = (days: number) => {
  if (days === 0) return 'today'
  if (days === 1) return '1 day ago'
  if (days < 14) return `${days} days ago`
  if (days < 45) return `${Math.round(days / 7)} weeks ago`
  if (days < 365) return `${Math.round(days / 30)} months ago`
  return `${Math.round(days / 365)} years ago`
}

export const addDaysFromToday = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

export const minDeliveryDate = () => addDaysFromToday(1)

export const datePresets = [
  { id: 'week', label: '1 week', days: 7 },
  { id: 'month', label: '1 month', days: 30 },
  { id: 'quarter', label: '3 months', days: 90 },
] as const
