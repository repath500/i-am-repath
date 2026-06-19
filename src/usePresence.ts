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

export const formatLastSeen = (minutesAgo: number) => {
  if (minutesAgo < 2) return 'someone was here just now'
  if (minutesAgo < 60) {
    return `someone was here ${minutesAgo} min${minutesAgo === 1 ? '' : 's'} ago`
  }

  const hours = Math.floor(minutesAgo / 60)
  const mins = minutesAgo % 60

  if (mins === 0) {
    return `someone was here ${hours} hr${hours === 1 ? '' : 's'} ago`
  }

  return `someone was here ${hours} hr ${mins} min${mins === 1 ? '' : 's'} ago`
}

export const usePresence = () => {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let visitorId = getVisitorId()
    let cancelled = false
    let hideTimer: number | undefined

    const pulse = async (shouldReveal: boolean) => {
      try {
        const response = await fetch('/api/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: visitorId }),
        })

        if (!response.ok || cancelled) return

        const data = (await response.json()) as {
          minutesAgo?: number | null
          enabled?: boolean
          id?: string
        }

        if (data.id) {
          visitorId = data.id
          window.localStorage.setItem(VISITOR_KEY, visitorId)
        }

        if (
          shouldReveal &&
          sessionStorage.getItem(SHOWN_KEY) !== '1' &&
          data.enabled &&
          data.minutesAgo !== null &&
          data.minutesAgo !== undefined &&
          data.minutesAgo <= 120
        ) {
          setMessage(formatLastSeen(data.minutesAgo))
          sessionStorage.setItem(SHOWN_KEY, '1')
          hideTimer = window.setTimeout(() => setMessage(null), 8000)
        }
      } catch {
        // presence is optional — ignore network failures
      }
    }

    pulse(true)
    const interval = window.setInterval(() => pulse(false), 60_000)

    return () => {
      cancelled = true
      window.clearInterval(interval)
      if (hideTimer) window.clearTimeout(hideTimer)
    }
  }, [])

  return message
}
