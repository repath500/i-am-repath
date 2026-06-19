const VISIBILITY_KEY = 'repath:public-letter-visible:v1'

export type RepathLetterView = 'preview' | 'expanded' | 'hidden'

export const getRepathLetterView = (): RepathLetterView => {
  if (typeof window === 'undefined') return 'preview'
  try {
    const value = window.localStorage.getItem(VISIBILITY_KEY)
    if (value === null) return 'preview'
    if (value === 'preview' || value === 'expanded' || value === 'hidden') {
      return value
    }
    if (value === 'true') return 'expanded'
    if (value === 'false') return 'hidden'
    return 'preview'
  } catch {
    return 'preview'
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
