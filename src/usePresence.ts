import { useEffect, useState } from 'react'

const VISITOR_KEY = 'repath:visitor-id'
const SHOWN_KEY = 'repath:presence-shown'

const getVisitorId = () => {
  let id = window.localStorage.getItem(VISITOR_KEY)
  if (!id) {
    id = crypto.randomUUID()
    window.localStorage.setItem(VISITOR_KEY, id)
  }
  return id
}

export const usePresence = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(SHOWN_KEY) === '1') return

    let visitorId = getVisitorId()
    let cancelled = false
    let hideTimer: number | undefined

    const pulse = async () => {
      try {
        const response = await fetch('/api/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: visitorId }),
        })

        if (!response.ok || cancelled) return

        const data = (await response.json()) as {
          others?: number
          enabled?: boolean
          id?: string
        }

        if (data.id) {
          visitorId = data.id
          window.localStorage.setItem(VISITOR_KEY, visitorId)
        }

        if (data.enabled && (data.others ?? 0) > 0) {
          setVisible(true)
          sessionStorage.setItem(SHOWN_KEY, '1')
          hideTimer = window.setTimeout(() => setVisible(false), 7000)
        }
      } catch {
        // presence is optional — ignore network failures
      }
    }

    pulse()
    const interval = window.setInterval(pulse, 12_000)

    return () => {
      cancelled = true
      window.clearInterval(interval)
      if (hideTimer) window.clearTimeout(hideTimer)
    }
  }, [])

  return visible
}
