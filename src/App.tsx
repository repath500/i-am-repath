import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CROSSFADE_MS,
  MUSIC_AMBIENT,
  MUSIC_FULL,
  OUTRO_SRC,
  duckMusicForSpeech,
} from './audioConfig'
import BuildingPreview from './BuildingPreview'
import LetterLandingPrompt from './LetterLandingPrompt'
import IdentityWhisper from './IdentityWhisper'
import SiteFooter from './SiteFooter'
import PresenceWhisper from './PresenceWhisper'
import { letterFrameLines } from './hiddenContent'
import { notes, type Note } from './notes'
import { useMusicMuted } from './useMusicMuted'
import { getNoteVoiceSrc } from './voices'
import { markNoteComplete, markVideoComplete } from './progress'

type ActiveNote = {
  note: Note
  index: number
}

type PostFrameMoment =
  | { kind: 'note'; note: Note; index: number }
  | { kind: 'letter'; line: string }

type Frame = {
  id: string
  src: string
  title: string
}

const frames: Frame[] = [
  { id: 'one', src: '/web-videos/1.mp4', title: 'living' },
  { id: 'two', src: '/web-videos/2.mp4', title: 'fly' },
  { id: 'three', src: '/web-videos/3.mp4', title: 'rise' },
  { id: 'four', src: '/web-videos/4.mp4', title: 'alive' },
  { id: 'five', src: '/web-videos/5.mp4', title: 'peace' },
  { id: 'six', src: '/web-videos/6.mp4', title: 'who cares' },
  { id: 'eight', src: '/web-videos/8.mp4', title: 'darkest hours' },
  { id: 'nine', src: '/web-videos/9.mp4', title: 'no option' },
  { id: 'ten', src: '/web-videos/10.mp4', title: 'i am' },
  { id: 'eleven', src: '/web-videos/11.mp4', title: 'smile' },
  { id: 'twelve', src: '/web-videos/12.mp4', title: 'figure it out' },
]

const shuffle = <T,>(input: T[]): T[] => {
  const arr = [...input]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const makeFrameQueue = (excludeId?: string): Frame[] => {
  const queue = shuffle(frames)
  if (excludeId && queue.length > 1 && queue[0].id === excludeId) {
    queue.push(queue.shift() as Frame)
  }
  return queue
}

const FRAME_STORAGE_KEY = 'repath:frames:v1'
const OUTRO_CROSSFADE_AT = 0.86
const NARRATION_AUTO_DELAY_MS = 2800

type FrameState = { current: Frame; queue: Frame[] }

const idsToFrames = (ids: string[]): Frame[] =>
  ids
    .map((id) => frames.find((frame) => frame.id === id))
    .filter((frame): frame is Frame => Boolean(frame))

const loadFrameState = (): FrameState => {
  let savedCurrent: string | undefined
  let savedQueue: string[] = []

  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(FRAME_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as { current?: string; queue?: string[] }
        savedCurrent = parsed.current
        savedQueue = parsed.queue ?? []
      }
    } catch {
      // ignore malformed storage and fall back to a fresh queue
    }
  }

  let queue = idsToFrames(savedQueue)

  if (queue.length === 0) {
    queue = makeFrameQueue(savedCurrent)
  }

  // On refresh, advance to the next clip instead of resuming the unfinished one.
  const next = queue.shift() as Frame

  if (savedCurrent) {
    const abandoned = frames.find((frame) => frame.id === savedCurrent)
    if (
      abandoned &&
      abandoned.id !== next.id &&
      !queue.some((frame) => frame.id === abandoned.id)
    ) {
      queue.push(abandoned)
    }
  }

  return { current: next, queue }
}

const saveFrameState = (state: FrameState) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      FRAME_STORAGE_KEY,
      JSON.stringify({
        current: state.current.id,
        queue: state.queue.map((frame) => frame.id),
      }),
    )
  } catch {
    // storage may be unavailable (private mode, quota) — ignore
  }
}

const pickNote = (exclude?: string): ActiveNote => {
  const pool = notes
    .map((note, index) => ({ note, index }))
    .filter(({ note }) => !exclude || note.text !== exclude)
  return pool[Math.floor(Math.random() * pool.length)]
}

const pickPostFrameMoment = (exclude?: string): PostFrameMoment => {
  const useLetter = Math.random() < 0.32
  if (useLetter) {
    const pool = letterFrameLines.filter((line) => line !== exclude)
    const line = pool[Math.floor(Math.random() * pool.length)] ?? letterFrameLines[0]
    return { kind: 'letter', line }
  }

  const picked = pickNote(exclude)
  return { kind: 'note', note: picked.note, index: picked.index }
}

const momentText = (moment: PostFrameMoment) =>
  moment.kind === 'letter' ? moment.line : moment.note.text

const momentLabel = (moment: PostFrameMoment, hasEnded: boolean, isPausedMidClip: boolean, develop: number) => {
  if (hasEnded || isPausedMidClip) {
    return moment.kind === 'letter' ? 'from the letter' : 'the note'
  }
  return develop > 0 ? 'developing' : ''
}

const getNoteTypography = (text: string, variant: 'desktop' | 'mobile') => {
  const length = text.length

  if (variant === 'desktop') {
    if (length > 320) {
      return { fontSize: 'clamp(1.05rem, 1.25vw, 1.45rem)', lineHeight: 1.26 }
    }
    if (length > 260) {
      return { fontSize: 'clamp(1.1rem, 1.4vw, 1.55rem)', lineHeight: 1.22 }
    }
    if (length > 200) {
      return { fontSize: 'clamp(1.25rem, 1.65vw, 1.85rem)', lineHeight: 1.16 }
    }
    if (length > 150) {
      return { fontSize: 'clamp(1.45rem, 2vw, 2.2rem)', lineHeight: 1.12 }
    }
    if (length > 100) {
      return { fontSize: 'clamp(1.65rem, 2.35vw, 2.65rem)', lineHeight: 1.08 }
    }
    return { fontSize: 'clamp(1.85rem, 3vw, 3.25rem)', lineHeight: 1.04 }
  }

  if (length > 320) {
    return { fontSize: 'clamp(1.05rem, 3.8vw, 1.4rem)', lineHeight: 1.28 }
  }
  if (length > 260) {
    return { fontSize: 'clamp(1.1rem, 4.1vw, 1.5rem)', lineHeight: 1.24 }
  }
  if (length > 200) {
    return { fontSize: 'clamp(1.2rem, 4.5vw, 1.7rem)', lineHeight: 1.18 }
  }
  if (length > 150) {
    return { fontSize: 'clamp(1.35rem, 5vw, 2rem)', lineHeight: 1.14 }
  }
  if (length > 100) {
    return { fontSize: 'clamp(1.55rem, 5.6vw, 2.35rem)', lineHeight: 1.1 }
  }
  return { fontSize: 'clamp(1.75rem, 6.2vw, 2.75rem)', lineHeight: 1.06 }
}

const getNoteRise = (text: string, variant: 'desktop' | 'mobile') => {
  const length = text.length
  if (variant === 'desktop') {
    if (length > 260) return 24
    if (length > 180) return 36
    return 48
  }
  if (length > 260) return 18
  if (length > 180) return 28
  return 36
}

function App() {
  const [frameState, setFrameState] = useState<FrameState>(loadFrameState)
  const [activeMoment, setActiveMoment] = useState<PostFrameMoment>(() => pickPostFrameMoment())
  const [hasEnded, setHasEnded] = useState(false)
  const [introDone, setIntroDone] = useState(false)
  const [soundBlocked, setSoundBlocked] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isNarrating, setIsNarrating] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const { musicMuted, toggleMusicMuted } = useMusicMuted()
  const videoRef = useRef<HTMLVideoElement>(null)
  const outroRef = useRef<HTMLAudioElement>(null)
  const narrationRef = useRef<HTMLAudioElement>(null)
  const noteRef = useRef<HTMLElement>(null)
  const fadeRafRef = useRef<number | null>(null)
  const narrationAutoTimerRef = useRef<number | null>(null)
  const musicMutedRef = useRef(musicMuted)

  musicMutedRef.current = musicMuted

  const displayText = momentText(activeMoment)
  const isLetterMoment = activeMoment.kind === 'letter'
  const frame = frameState.current
  const isVideoFocused = isPlaying && !hasEnded
  const isPausedMidClip = !isPlaying && progress > 0 && !hasEnded
  const develop = hasEnded || isPausedMidClip ? 1 : progress
  const frameLabel = momentLabel(activeMoment, hasEnded, isPausedMidClip, develop)
  const desktopNoteTypography = useMemo(() => getNoteTypography(displayText, 'desktop'), [displayText])
  const mobileNoteTypography = useMemo(() => getNoteTypography(displayText, 'mobile'), [displayText])
  const desktopNoteRise = useMemo(() => getNoteRise(displayText, 'desktop'), [displayText])
  const mobileNoteRise = useMemo(() => getNoteRise(displayText, 'mobile'), [displayText])

  const clock = now
    .toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .toLowerCase()

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    saveFrameState(frameState)
  }, [frameState])

  const cancelNarrationAuto = () => {
    if (narrationAutoTimerRef.current) {
      window.clearTimeout(narrationAutoTimerRef.current)
      narrationAutoTimerRef.current = null
    }
  }

  const stopMusic = () => {
    cancelNarrationAuto()

    if (fadeRafRef.current) {
      cancelAnimationFrame(fadeRafRef.current)
      fadeRafRef.current = null
    }

    const narration = narrationRef.current
    if (narration) {
      narration.pause()
      narration.currentTime = 0
      narration.onended = null
      narration.onerror = null
    }
    setIsNarrating(false)

    const audio = outroRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      audio.volume = 0
    }

    const video = videoRef.current
    if (video) {
      video.volume = 1
    }
  }

  const smoothstep = (t: number) => t * t * (3 - 2 * t)

  const fadeVolume = (
    element: HTMLMediaElement | null,
    target: number,
    durationMs = CROSSFADE_MS,
  ) => {
    if (!element) return Promise.resolve()

    if (fadeRafRef.current) {
      cancelAnimationFrame(fadeRafRef.current)
      fadeRafRef.current = null
    }

    if (target > 0 && element.paused) {
      element.volume = 0
      element.play().catch(() => {})
    }

    const from = element.volume
    const start = performance.now()

    return new Promise<void>((resolve) => {
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs)
        const eased = smoothstep(t)
        element.volume = from + (target - from) * eased

        if (t < 1) {
          fadeRafRef.current = requestAnimationFrame(tick)
        } else {
          element.volume = target
          if (target === 0) {
            element.pause()
          }
          fadeRafRef.current = null
          resolve()
        }
      }
      fadeRafRef.current = requestAnimationFrame(tick)
    })
  }

  const crossfadeMusicToVideo = (durationMs = CROSSFADE_MS) => {
    const video = videoRef.current
    const audio = outroRef.current
    if (!video || !audio) return Promise.resolve()

    if (fadeRafRef.current) {
      cancelAnimationFrame(fadeRafRef.current)
      fadeRafRef.current = null
    }

    const start = performance.now()
    const videoFrom = video.volume
    const audioFrom = audio.paused ? 0 : audio.volume

    return new Promise<void>((resolve) => {
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs)
        const eased = smoothstep(t)
        video.volume = videoFrom + (1 - videoFrom) * eased
        audio.volume = audioFrom * (1 - eased)

        if (t < 1) {
          fadeRafRef.current = requestAnimationFrame(tick)
        } else {
          video.volume = 1
          audio.volume = 0
          audio.pause()
          fadeRafRef.current = null
          resolve()
        }
      }
      fadeRafRef.current = requestAnimationFrame(tick)
    })
  }

  const crossfadeVideoToMusic = (target = MUSIC_FULL, durationMs = CROSSFADE_MS) => {
    const video = videoRef.current
    const audio = outroRef.current
    if (!video || !audio) return Promise.resolve()

    if (musicMutedRef.current) {
      return Promise.resolve()
    }

    if (fadeRafRef.current) {
      cancelAnimationFrame(fadeRafRef.current)
      fadeRafRef.current = null
    }

    audio.loop = true
    if (audio.paused) {
      audio.volume = 0
      audio.play().catch(() => {})
    }

    const start = performance.now()
    const videoFrom = video.volume
    const audioFrom = audio.volume

    return new Promise<void>((resolve) => {
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs)
        const eased = smoothstep(t)
        video.volume = videoFrom * (1 - eased)
        audio.volume = audioFrom + (target - audioFrom) * eased

        if (t < 1) {
          fadeRafRef.current = requestAnimationFrame(tick)
        } else {
          video.volume = 0
          audio.volume = target
          fadeRafRef.current = null
          resolve()
        }
      }
      fadeRafRef.current = requestAnimationFrame(tick)
    })
  }

  const beginVideoPlayback = async () => {
    const video = videoRef.current
    if (!video) throw new Error('no video')

    video.muted = false
    video.volume = 0
    await video.play()
    await crossfadeMusicToVideo()
  }

  const playNoteNarration = (noteIndex: number) => {
    cancelNarrationAuto()

    const narration = narrationRef.current
    const src = getNoteVoiceSrc(noteIndex)
    if (!narration || !src) return

    narration.pause()
    narration.currentTime = 0
    narration.src = src
    narration.volume = 1
    setIsNarrating(true)

    narration.onended = () => {
      setIsNarrating(false)
      markNoteComplete(noteIndex)
      if (!musicMutedRef.current) {
        fadeVolume(outroRef.current, MUSIC_FULL, 1200)
      }
    }

    narration.onerror = () => {
      setIsNarrating(false)
      if (!musicMutedRef.current) {
        fadeVolume(outroRef.current, MUSIC_FULL, 900)
      }
    }

    duckMusicForSpeech(outroRef.current, musicMutedRef.current)
    narration.play().catch(() => {
      setIsNarrating(false)
      if (!musicMutedRef.current) {
        fadeVolume(outroRef.current, MUSIC_FULL, 900)
      }
    })
  }

  const listenToNote = () => {
    if (activeMoment.kind !== 'note') return
    playNoteNarration(activeMoment.index)
  }

  const beginOutroCrossfade = (blend: number) => {
    const video = videoRef.current
    const audio = outroRef.current
    if (!video || !audio) return

    video.volume = Math.max(0, 1 - blend)

    if (musicMutedRef.current) return

    if (audio.paused && blend > 0) {
      audio.loop = true
      audio.volume = 0
      audio.play().catch(() => {})
    }

    audio.volume = MUSIC_FULL * blend
  }

  const finishOutro = () => {
    const video = videoRef.current
    const audio = outroRef.current

    markVideoComplete(frame.id)

    if (video) {
      video.pause()
      video.volume = 0
    }

    if (musicMutedRef.current || !audio) return

    audio.loop = true
    if (audio.paused) {
      audio.volume = 0
      audio
        .play()
        .then(() => fadeVolume(audio, MUSIC_FULL, 1400))
        .catch(() => {})
      return
    }

    fadeVolume(audio, MUSIC_FULL, 900)
  }

  useEffect(() => {
    const audio = outroRef.current
    if (!audio) return

    if (musicMuted) {
      fadeVolume(audio, 0, 700)
      return
    }

    if (hasEnded) {
      fadeVolume(audio, MUSIC_FULL, 1200)
    } else if (isPausedMidClip) {
      fadeVolume(audio, MUSIC_AMBIENT, 1200)
    }
  }, [musicMuted, hasEnded, isPausedMidClip])

  useEffect(() => {
    stopMusic()
    videoRef.current?.load()

    return () => stopMusic()
  }, [frame])

  useEffect(() => {
    if (!introDone) return

    const timer = window.setTimeout(() => {
      beginVideoPlayback()
        .then(() => setSoundBlocked(false))
        .catch(() => setSoundBlocked(true))
    }, 260)

    return () => window.clearTimeout(timer)
  }, [frame, introDone])

  useEffect(() => {
    if (!hasEnded) {
      cancelNarrationAuto()
      setIsNarrating(false)
      return
    }

    if (soundBlocked) return
    if (activeMoment.kind !== 'note') return

    narrationAutoTimerRef.current = window.setTimeout(() => {
      playNoteNarration(activeMoment.index)
    }, NARRATION_AUTO_DELAY_MS)

    return cancelNarrationAuto
  }, [hasEnded, activeMoment, soundBlocked])

  useEffect(() => {
    if (!hasEnded) return
    if (window.matchMedia('(min-width: 768px)').matches) return

    const timer = window.setTimeout(() => {
      noteRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 550)

    return () => window.clearTimeout(timer)
  }, [hasEnded])

  const replay = () => {
    const video = videoRef.current
    if (!video) return

    cancelNarrationAuto()
    setIsNarrating(false)
    setHasEnded(false)
    setProgress(0)
    video.currentTime = 0
    beginVideoPlayback().catch(() => setSoundBlocked(true))
  }

  const chooseAnother = () => {
    stopMusic()
    setHasEnded(false)
    setIsPlaying(false)
    setIsReady(false)
    setSoundBlocked(false)
    setIntroDone(true)
    setProgress(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setActiveMoment((current) => {
      const exclude = current.kind === 'note' ? current.note.text : current.line
      return pickPostFrameMoment(exclude)
    })
    setFrameState((current) => {
      const queue =
        current.queue.length === 0
          ? makeFrameQueue(current.current.id)
          : [...current.queue]
      const next = queue.shift() as Frame
      return { current: next, queue }
    })
  }

  const enableSound = () => {
    beginVideoPlayback()
      .then(() => setSoundBlocked(false))
      .catch(() => setSoundBlocked(true))
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video || hasEnded) return

    if (video.paused) {
      video.muted = false
      video.volume = 0
      video
        .play()
        .then(() => crossfadeMusicToVideo())
        .catch(() => {})
    } else {
      video.pause()
      crossfadeVideoToMusic(MUSIC_AMBIENT)
    }
  }

  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden bg-[#050505] text-stone-100">
      <audio ref={outroRef} src={OUTRO_SRC} preload="auto" loop />
      <audio ref={narrationRef} preload="none" />
      <PresenceWhisper />
      <IdentityWhisper />
      <div className="pointer-events-none fixed inset-0 grain opacity-[0.13]" />
      <div
        className={`pointer-events-none fixed inset-0 z-20 bg-[#050505]/88 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          isVideoFocused ? 'opacity-100' : 'pointer-events-none invisible opacity-0'
        }`}
        aria-hidden="true"
      />
      <section className="relative grid min-h-[100dvh] grid-cols-1 content-between px-4 py-5 sm:px-6 md:px-10 md:py-8">
        {!introDone && (
          <div
            className="intro-title pointer-events-none fixed inset-0 z-10 grid place-items-center"
            onAnimationEnd={() => setIntroDone(true)}
          >
            <p className="pointer-events-none font-stoke text-[clamp(2.2rem,8vw,7.5rem)] font-light lowercase tracking-[0] text-stone-100">
              i am repath
            </p>
          </div>
        )}

        <div className="mx-auto grid w-full max-w-[1400px] flex-1 items-center gap-8 py-12 md:grid-cols-[minmax(0,1fr)_minmax(360px,0.68fr)] md:gap-12 md:py-6">
          <div className="relative z-30 order-2 hidden min-h-0 max-h-[min(72dvh,640px)] flex-col justify-center py-6 md:order-1 md:flex md:py-8">
            <p
              className={`mb-2 max-w-[38ch] font-crimson text-xl italic leading-[1.18] text-stone-400 transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                develop > 0.08
                  ? 'pointer-events-none max-h-0 overflow-hidden opacity-0'
                  : 'opacity-100'
              }`}
            >
              a quiet record of becoming. some moments i kept, and the small
              truths they left behind.
            </p>
            <p
              className={`mb-8 font-stoke text-[0.62rem] lowercase tracking-[0.2em] text-stone-600 transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                develop > 0.08
                  ? 'pointer-events-none max-h-0 overflow-hidden opacity-0'
                  : 'opacity-100'
              }`}
            >
              repath khan · builder · ireland
            </p>

            <div className="font-stoke text-[0.68rem] lowercase tracking-[0.2em] text-stone-600">
              {frameLabel}
            </div>

            <p
              className={`mt-4 max-w-[42ch] font-crimson font-normal tracking-[0] text-stone-100 transition-[filter,opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isLetterMoment && (hasEnded || isPausedMidClip) ? 'italic' : ''
              }`}
              style={{
                ...desktopNoteTypography,
                filter: `blur(${(1 - develop) * 10}px)`,
                opacity: develop > 0 ? 0.12 + develop * 0.88 : 0,
                transform: `translateY(${(1 - develop) * desktopNoteRise}px)`,
              }}
            >
              {displayText}
            </p>

            <div
              className="mt-8 flex flex-wrap gap-3 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: hasEnded ? 1 : 0,
                pointerEvents: hasEnded ? 'auto' : 'none',
              }}
            >
              {!isLetterMoment ? (
                <button
                  type="button"
                  onClick={listenToNote}
                  className="border border-white/15 px-5 py-3 font-stoke text-xs lowercase tracking-[0.08em] text-stone-300 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/35 hover:text-stone-100 active:translate-y-[1px]"
                >
                  {isNarrating ? 'reading' : 'listen'}
                </button>
              ) : null}
              <button
                type="button"
                onClick={replay}
                className="border border-white/15 bg-stone-100 px-5 py-3 font-stoke text-xs lowercase tracking-[0.08em] text-[#050505] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white active:translate-y-[1px]"
              >
                play again
              </button>
              <button
                type="button"
                onClick={chooseAnother}
                className="border border-white/15 px-5 py-3 font-stoke text-xs lowercase tracking-[0.08em] text-stone-300 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/35 hover:text-stone-100 active:translate-y-[1px]"
              >
                another frame
              </button>
            </div>
          </div>

          <div
            className={`order-1 justify-self-center md:order-2 md:justify-self-end ${
              isVideoFocused ? 'relative z-30' : ''
            }`}
          >
            <div
              className={`group video-shell relative aspect-square w-[min(88vw,72dvh,640px)] overflow-hidden bg-[#090909] transition-[box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                introDone ? 'is-revealed' : ''
              } ${isVideoFocused ? 'shadow-[0_0_120px_rgba(0,0,0,0.85)]' : ''}`}
            >
              {!isReady && (
                <div className="absolute inset-0 skeleton" aria-hidden="true" />
              )}
              <video
                key={frame.id}
                ref={videoRef}
                className={`pointer-events-none h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isReady ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.015]'
                } ${isVideoFocused ? 'brightness-110' : 'brightness-[0.82]'}`}
                playsInline
                preload="auto"
                controls={false}
                onCanPlay={() => {
                  setIsReady(true)
                  if (videoRef.current) videoRef.current.muted = false
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={() => {
                  const video = videoRef.current
                  if (video && video.duration) {
                    const nextProgress = Math.min(1, video.currentTime / video.duration)
                    setProgress(nextProgress)

                    if (nextProgress >= OUTRO_CROSSFADE_AT) {
                      const blend =
                        (nextProgress - OUTRO_CROSSFADE_AT) / (1 - OUTRO_CROSSFADE_AT)
                      beginOutroCrossfade(blend)
                    }
                  }
                }}
                onEnded={() => {
                  finishOutro()
                  setIsPlaying(false)
                  setProgress(1)
                  setHasEnded(true)
                }}
              >
                <source src={frame.src} />
              </video>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050505]/80 to-transparent" />

              {isReady && !hasEnded && (
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'pause video' : 'play video'}
                  className="absolute inset-0 z-[5] cursor-pointer bg-transparent"
                />
              )}

              {isReady && !hasEnded && (
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'pause' : 'play'}
                  className={`absolute bottom-4 right-4 z-10 grid h-9 w-9 place-items-center rounded-full backdrop-blur-sm transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:translate-y-[1px] ${
                    isPlaying
                      ? 'bg-[#050505]/20 text-stone-100/35 opacity-40 md:opacity-0 md:group-hover:opacity-100 md:group-hover:bg-[#050505]/40 md:group-hover:text-stone-100/80'
                      : 'bg-[#050505]/35 text-stone-100/75 opacity-100 hover:bg-[#050505]/55 hover:text-stone-100'
                  }`}
                >
                  {isPlaying ? (
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true">
                      <rect x="0" width="3" height="12" rx="0.5" />
                      <rect x="7" width="3" height="12" rx="0.5" />
                    </svg>
                  ) : (
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true">
                      <path d="M0.8 0.6 L9.4 6 L0.8 11.4 Z" />
                    </svg>
                  )}
                </button>
              )}

              {soundBlocked && (
                <button
                  type="button"
                  onClick={enableSound}
                  className="absolute bottom-4 left-4 z-10 border border-white/15 bg-stone-100 px-4 py-2 font-stoke text-xs lowercase text-[#050505] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white active:translate-y-[1px]"
                >
                  tap for sound
                </button>
              )}

              {hasEnded && (
                <div className="absolute inset-0 z-10 flex items-center justify-center gap-5 bg-[#050505]/45">
                  <button
                    type="button"
                    onClick={replay}
                    className="font-stoke text-[0.7rem] lowercase tracking-[0.16em] text-stone-100 transition duration-300 hover:text-white"
                  >
                    replay
                  </button>
                  <span className="text-white/15" aria-hidden="true">
                    ·
                  </span>
                  <button
                    type="button"
                    onClick={chooseAnother}
                    className="font-stoke text-[0.7rem] lowercase tracking-[0.16em] text-stone-400 transition duration-300 hover:text-stone-100"
                  >
                    another frame
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 font-stoke text-[0.68rem] lowercase tracking-[0.18em] text-stone-500">
              <span>{frame.title}</span>
              <span>{hasEnded ? 'september' : 'playing once'}</span>
            </div>
          </div>
        </div>

        <BuildingPreview />

        <LetterLandingPrompt />

        <SiteFooter
          layout="home"
          clock={clock}
          musicMuted={musicMuted}
          onToggleMusic={toggleMusicMuted}
        />
      </section>

      <section
        ref={noteRef}
        className="relative mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 md:hidden md:px-10"
      >
        <div className="font-stoke text-[0.68rem] lowercase tracking-[0.2em] text-stone-600">
          {frameLabel}
        </div>
        <p
          className={`mt-4 max-w-[34ch] font-crimson font-normal tracking-[0] text-stone-100 transition-[filter,opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isLetterMoment && (hasEnded || isPausedMidClip) ? 'italic' : ''
          }`}
          style={{
            ...mobileNoteTypography,
            filter: `blur(${(1 - develop) * 10}px)`,
            opacity: develop > 0 ? 0.12 + develop * 0.88 : 0,
            transform: `translateY(${(1 - develop) * mobileNoteRise}px)`,
          }}
        >
          {displayText}
        </p>
        <div
          className="mt-8 flex flex-wrap gap-3 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: hasEnded ? 1 : 0,
            pointerEvents: hasEnded ? 'auto' : 'none',
          }}
        >
          {!isLetterMoment ? (
            <button
              type="button"
              onClick={listenToNote}
              className="border border-white/15 px-5 py-3 font-stoke text-xs lowercase tracking-[0.08em] text-stone-300 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/35 hover:text-stone-100 active:translate-y-[1px]"
            >
              {isNarrating ? 'reading' : 'listen'}
            </button>
          ) : null}
          <button
            type="button"
            onClick={replay}
            className="border border-white/15 bg-stone-100 px-5 py-3 font-stoke text-xs lowercase tracking-[0.08em] text-[#050505] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white active:translate-y-[1px]"
          >
            play again
          </button>
          <button
            type="button"
            onClick={chooseAnother}
            className="border border-white/15 px-5 py-3 font-stoke text-xs lowercase tracking-[0.08em] text-stone-300 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/35 hover:text-stone-100 active:translate-y-[1px]"
          >
            another frame
          </button>
        </div>
      </section>
    </main>
  )
}

export default App
