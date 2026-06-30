import { repathPublicLetters } from './hiddenContent'

const VISIBILITY_KEY = 'repath:public-letter-visible:v2'
const EXPANDED_KEY = 'repath:letter-expanded:v1'

export type RepathLetterView = 'preview' | 'expanded' | 'hidden'

export const getRepathLetterView = (): RepathLetterView => {
  if (typeof window === 'undefined') return 'expanded'
  try {
    const value = window.localStorage.getItem(VISIBILITY_KEY)
    if (value === null) return 'expanded'
    if (value === 'preview' || value === 'expanded' || value === 'hidden') {
      return value
    }
    if (value === 'true') return 'expanded'
    if (value === 'false') return 'hidden'
    return 'expanded'
  } catch {
    return 'expanded'
  }
}

export const setRepathLetterView = (view: RepathLetterView) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(VISIBILITY_KEY, view)
  } catch {
    // storage unavailable
  }
}

const defaultExpandedState = () => {
  const latestId = repathPublicLetters[repathPublicLetters.length - 1]?.id
  return Object.fromEntries(
    repathPublicLetters.map((letter) => [letter.id, letter.id === latestId]),
  )
}

export const getLetterExpandedState = (): Record<string, boolean> => {
  const defaults = defaultExpandedState()
  if (typeof window === 'undefined') return defaults
  try {
    const raw = window.localStorage.getItem(EXPANDED_KEY)
    if (!raw) return defaults
    const parsed = JSON.parse(raw) as Record<string, boolean>
    return { ...defaults, ...parsed }
  } catch {
    return defaults
  }
}

export const setLetterExpanded = (letterId: string, expanded: boolean) => {
  if (typeof window === 'undefined') return
  try {
    const next = { ...getLetterExpandedState(), [letterId]: expanded }
    window.localStorage.setItem(EXPANDED_KEY, JSON.stringify(next))
  } catch {
    // storage unavailable
  }
}
