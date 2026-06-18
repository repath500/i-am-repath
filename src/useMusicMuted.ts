import { useCallback, useState } from 'react'
import { readMusicMuted, writeMusicMuted } from './audioConfig'

export const useMusicMuted = () => {
  const [musicMuted, setMusicMuted] = useState(readMusicMuted)

  const toggleMusicMuted = useCallback(() => {
    setMusicMuted((current) => {
      const next = !current
      writeMusicMuted(next)
      return next
    })
  }, [])

  return { musicMuted, toggleMusicMuted }
}
