export type SavedLetter = {
  id: string
  text: string
  deliverAt: string
  createdAt: string
  openedAt?: string
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

export const addLetter = (text: string, deliverAt: string): SavedLetter => {
  const letter: SavedLetter = {
    id: crypto.randomUUID(),
    text: text.trim(),
    deliverAt,
    createdAt: new Date().toISOString(),
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

export const formatLetterDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`)
  return date.toLocaleDateString([], {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export const minDeliveryDate = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().slice(0, 10)
}
