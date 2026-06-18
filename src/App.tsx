import { useEffect, useMemo, useRef, useState } from 'react'
import { notes } from './notes'
import { navigate } from './router'

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

const pickNote = (exclude?: string) => {
  const pool = exclude ? notes.filter((item) => item.text !== exclude) : notes
  return pool[Math.floor(Math.random() * pool.length)].text
}

const getNoteTypography = (text: string, variant: 'desktop' | 'mobile') => {
  const length = text.length

  if (variant === 'desktop') {
    if (length > 320) {
      return { fontSize: 'clamp(0.9rem, 1.05vw, 1.2rem)', lineHeight: 1.3 }
    }
    if (length > 260) {
      return { fontSize: 'clamp(0.95rem, 1.15vw, 1.3rem)', lineHeight: 1.26 }
    }
    if (length > 200) {
      return { fontSize: 'clamp(1.05rem, 1.35vw, 1.45rem)', lineHeight: 1.22 }
    }
    if (length > 150) {
      return { fontSize: 'clamp(1.15rem, 1.55vw, 1.65rem)', lineHeight: 1.16 }
    }
    if (length > 100) {
      return { fontSize: 'clamp(1.35rem, 1.85vw, 2rem)', lineHeight: 1.12 }
    }
    return { fontSize: 'clamp(1.55rem, 2.2vw, 2.45rem)', lineHeight: 1.08 }
  }

  if (length > 320) {
    return { fontSize: 'clamp(1rem, 3.6vw, 1.3rem)', lineHeight: 1.3 }
  }
  if (length > 260) {
    return { fontSize: 'clamp(1.05rem, 3.9vw, 1.4rem)', lineHeight: 1.26 }
  }
  if (length > 200) {
    return { fontSize: 'clamp(1.15rem, 4.2vw, 1.55rem)', lineHeight: 1.22 }
  }
  if (length > 150) {
    return { fontSize: 'clamp(1.3rem, 4.8vw, 1.85rem)', lineHeight: 1.16 }
  }
  if (length > 100) {
    return { fontSize: 'clamp(1.45rem, 5.4vw, 2.15rem)', lineHeight: 1.12 }
  }
  return { fontSize: 'clamp(1.65rem, 6vw, 2.5rem)', lineHeight: 1.08 }
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
  const [note, setNote] = useState(() => pickNote())
  const [hasEnded, setHasEnded] = useState(false)
  const [introDone, setIntroDone] = useState(false)
  const [soundBlocked, setSoundBlocked] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const noteRef = useRef<HTMLElement>(null)

  const frame = frameState.current
  const isVideoFocused = isPlaying && !hasEnded
  const develop = hasEnded ? 1 : progress
  const desktopNoteTypography = useMemo(() => getNoteTypography(note, 'desktop'), [note])
  const mobileNoteTypography = useMemo(() => getNoteTypography(note, 'mobile'), [note])
  const desktopNoteRise = useMemo(() => getNoteRise(note, 'desktop'), [note])
  const mobileNoteRise = useMemo(() => getNoteRise(note, 'mobile'), [note])

  useEffect(() => {
    saveFrameState(frameState)
  }, [frameState])

  useEffect(() => {
    videoRef.current?.load()
  }, [frame])

  const playWithSound = () => {
    const video = videoRef.current
    if (!video) return Promise.reject()

    video.muted = false
    video.volume = 1
    return video.play()
  }

  useEffect(() => {
    if (!introDone) return

    const timer = window.setTimeout(() => {
      playWithSound()
        .then(() => setSoundBlocked(false))
        .catch(() => setSoundBlocked(true))
    }, 260)

    return () => window.clearTimeout(timer)
  }, [frame, introDone])

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

    setHasEnded(false)
    setProgress(0)
    video.currentTime = 0
    playWithSound().catch(() => setSoundBlocked(true))
  }

  const chooseAnother = () => {
    setHasEnded(false)
    setIsPlaying(false)
    setIsReady(false)
    setSoundBlocked(false)
    setIntroDone(true)
    setProgress(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setNote((current) => pickNote(current))
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
    playWithSound().then(() => setSoundBlocked(false))
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }

  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden bg-[#050505] text-stone-100">
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
          <div className="relative z-30 order-2 hidden min-h-0 max-h-[min(64dvh,560px)] flex-col justify-center md:order-1 md:flex">
            <p
              className={`mb-8 max-w-[38ch] font-crimson text-xl italic leading-[1.18] text-stone-400 transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                develop > 0.08
                  ? 'pointer-events-none max-h-0 overflow-hidden opacity-0'
                  : 'opacity-100'
              }`}
            >
              a quiet record of becoming. some moments i kept, and the small
              truths they left behind.
            </p>

            <div className="font-stoke text-[0.68rem] lowercase tracking-[0.2em] text-stone-600">
              {hasEnded ? 'the note' : develop > 0 ? 'developing' : ''}
            </div>

            <p
              className="mt-4 max-w-[42ch] font-crimson font-normal tracking-[0] text-stone-100 transition-[filter,opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                ...desktopNoteTypography,
                filter: `blur(${(1 - develop) * 10}px)`,
                opacity: develop > 0 ? 0.12 + develop * 0.88 : 0,
                transform: `translateY(${(1 - develop) * desktopNoteRise}px)`,
              }}
            >
              {note}
            </p>

            <div
              className="mt-8 flex flex-wrap gap-3 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: hasEnded ? 1 : 0,
                pointerEvents: hasEnded ? 'auto' : 'none',
              }}
            >
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
                    setProgress(Math.min(1, video.currentTime / video.duration))
                  }
                }}
                onEnded={() => {
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
                  className="absolute bottom-4 left-4 border border-white/15 bg-stone-100 px-4 py-2 font-stoke text-xs lowercase text-[#050505] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white active:translate-y-[1px]"
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
              <span>{hasEnded ? 'ended' : 'playing once'}</span>
            </div>
          </div>
        </div>

        <footer className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 border-t border-white/10 pt-4 font-stoke text-[0.6rem] lowercase tracking-[0.1em] text-stone-500 sm:text-[0.68rem] sm:tracking-[0.14em]">
          <span className="flex items-center gap-2">
            <span>2026</span>
            <span className="text-white/15" aria-hidden="true">|</span>
            <a
              href="/notes"
              onClick={(event) => {
                event.preventDefault()
                navigate('/notes')
              }}
              className="transition hover:text-stone-100"
            >
              notes
            </a>
          </span>
          <span>
            ©{' '}
            <a
              href="https://www.linkedin.com/in/repathkhan/"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-stone-100"
            >
              repath khan
            </a>
          </span>
        </footer>
      </section>

      <section
        ref={noteRef}
        className="relative mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 md:hidden md:px-10"
      >
        <div className="font-stoke text-[0.68rem] lowercase tracking-[0.2em] text-stone-600">
          {hasEnded ? 'the note' : develop > 0 ? 'developing' : ''}
        </div>
        <p
          className="mt-4 max-w-[34ch] font-crimson font-normal tracking-[0] text-stone-100 transition-[filter,opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            ...mobileNoteTypography,
            filter: `blur(${(1 - develop) * 10}px)`,
            opacity: develop > 0 ? 0.12 + develop * 0.88 : 0,
            transform: `translateY(${(1 - develop) * mobileNoteRise}px)`,
          }}
        >
          {note}
        </p>
        <div
          className="mt-8 flex flex-wrap gap-3 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: hasEnded ? 1 : 0,
            pointerEvents: hasEnded ? 'auto' : 'none',
          }}
        >
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
