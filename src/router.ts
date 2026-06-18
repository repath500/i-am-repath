import { useEffect, useState } from 'react'
import { notes } from './notes'

export type AppRoute =
  | { page: 'home' }
  | { page: 'notes'; noteIndex?: number }
  | { page: 'letter'; deliveryId?: string }

export const parseRoute = (path: string): AppRoute => {
  if (path === '/letter') return { page: 'letter' }

  const deliveryMatch = path.match(/^\/letter\/([a-z0-9-]+)$/i)
  if (deliveryMatch) {
    return { page: 'letter', deliveryId: deliveryMatch[1] }
  }

  const noteMatch = path.match(/^\/notes\/(\d{1,2})$/)
  if (noteMatch) {
    const displayId = Number(noteMatch[1])
    const noteIndex = displayId - 1
    if (noteIndex >= 0 && noteIndex < notes.length) {
      return { page: 'notes', noteIndex }
    }
  }

  if (path === '/notes') return { page: 'notes' }
  return { page: 'home' }
}

export const getNoteSharePath = (noteIndex: number) =>
  `/notes/${String(noteIndex + 1).padStart(2, '0')}`

export const navigate = (path: string) => {
  if (window.location.pathname === path) return
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0 })
}

export const useRoute = (): AppRoute => {
  const [route, setRoute] = useState<AppRoute>(() =>
    typeof window === 'undefined' ? { page: 'home' } : parseRoute(window.location.pathname),
  )

  useEffect(() => {
    const onChange = () => setRoute(parseRoute(window.location.pathname))
    window.addEventListener('popstate', onChange)
    return () => window.removeEventListener('popstate', onChange)
  }, [])

  return route
}
