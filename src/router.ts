import { useEffect, useState } from 'react'

export const navigate = (path: string) => {
  if (window.location.pathname === path) return
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0 })
}

export const useRoute = () => {
  const [path, setPath] = useState(() =>
    typeof window === 'undefined' ? '/' : window.location.pathname,
  )

  useEffect(() => {
    const onChange = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onChange)
    return () => window.removeEventListener('popstate', onChange)
  }, [])

  return path
}
