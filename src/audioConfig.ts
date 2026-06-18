export const OUTRO_SRC = '/audio/sparky-deathcap-september.mp3'
export const MUSIC_AMBIENT = 0.09
export const MUSIC_FULL = 0.2
export const MUSIC_NARRATION_DUCK = 0.055
export const CROSSFADE_MS = 1800
export const MUSIC_MUTED_KEY = 'repath:music-muted'

export const readMusicMuted = (): boolean => {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(MUSIC_MUTED_KEY) === '1'
  } catch {
    return false
  }
}

export const writeMusicMuted = (muted: boolean) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(MUSIC_MUTED_KEY, muted ? '1' : '0')
  } catch {
    // storage may be unavailable — ignore
  }
}

const smoothstep = (t: number) => t * t * (3 - 2 * t)

export const fadeVolume = (
  element: HTMLMediaElement,
  target: number,
  durationMs = CROSSFADE_MS,
) =>
  new Promise<void>((resolve) => {
    if (target > 0 && element.paused) {
      element.volume = 0
      element.play().catch(() => {})
    }

    const from = element.volume
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = smoothstep(t)
      element.volume = from + (target - from) * eased

      if (t < 1) {
        requestAnimationFrame(tick)
      } else {
        element.volume = target
        if (target === 0) {
          element.pause()
        }
        resolve()
      }
    }

    requestAnimationFrame(tick)
  })

export const startAmbientMusic = (audio: HTMLAudioElement) => {
  audio.loop = true
  audio.volume = 0
  return audio.play().then(() => fadeVolume(audio, MUSIC_AMBIENT, 2600))
}

export const isMusicAudible = (audio: HTMLMediaElement | null) =>
  Boolean(audio && !audio.paused && audio.volume > 0.015)

export const duckMusicForSpeech = (
  audio: HTMLMediaElement | null,
  musicMuted: boolean,
) => {
  if (!audio || musicMuted || !isMusicAudible(audio)) {
    return Promise.resolve()
  }

  const target = Math.max(MUSIC_NARRATION_DUCK, audio.volume * 0.58)
  return fadeVolume(audio, target, 650)
}
