import { useEffect, useRef, useState } from 'react'

const RESPECT_MS = 20 * 60 * 1000

export const useActiveTime = () => {
  const [earnedRespect, setEarnedRespect] = useState(false)
  const activeMsRef = useRef(0)
  const lastTickRef = useRef<number | null>(null)

  useEffect(() => {
    const tick = (now: number) => {
      if (document.visibilityState === 'visible' && lastTickRef.current !== null) {
        activeMsRef.current += now - lastTickRef.current
        if (activeMsRef.current >= RESPECT_MS) {
          setEarnedRespect(true)
        }
      }
      lastTickRef.current = now
    }

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        lastTickRef.current = null
      } else {
        lastTickRef.current = performance.now()
      }
    }

    lastTickRef.current = performance.now()
    const interval = window.setInterval(() => tick(performance.now()), 1000)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return earnedRespect
}
