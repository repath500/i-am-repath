import { useEffect, useRef, useState } from 'react'
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
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(FRAME_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as { current?: string; queue?: string[] }
        const current = frames.find((frame) => frame.id === parsed.current)
        const queue = idsToFrames(parsed.queue ?? [])
        if (current) {
          return { current, queue }
        }
      }
    } catch {
      // ignore malformed storage and fall back to a fresh queue
    }
  }

  const queue = makeFrameQueue()
  const first = queue.shift() as Frame
  return { current: first, queue }
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

function App() {
  const [frameState, setFrameState] = useState<FrameState>(loadFrameState)
  const [note, setNote] = useState(() => pickNote())
  const [hasEnded, setHasEnded] = useState(false)
  const [introDone, setIntroDone] = useState(false)
  const [soundBlocked, setSoundBlocked] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stillFrame, setStillFrame] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const noteRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const frame = frameState.current
  const isVideoFocused = isPlaying && !hasEnded
  const develop = hasEnded ? 1 : progress

  const captureStill = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const width = video.videoWidth
    const height = video.videoHeight
    if (!width || !height) return

    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    try {
      ctx.drawImage(video, 0, 0, width, height)
      setStillFrame(canvas.toDataURL('image/jpeg', 0.82))
    } catch {
      setStillFrame(null)
    }
  }

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
    setStillFrame(null)
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
    setStillFrame(null)
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
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
      <div className="pointer-events-none fixed inset-0 grain opacity-[0.13]" />
      <div
        className={`pointer-events-none fixed inset-0 z-20 bg-[#050505]/88 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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

        <div className="mx-auto grid w-full max-w-[1400px] flex-1 items-center gap-8 py-12 md:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.68fr)] md:gap-12 md:py-6">
          <aside className="order-2 hidden max-w-[38ch] self-end pb-8 md:block">
            <p
              className={`font-crimson text-xl italic leading-[1.18] text-stone-400 transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isPlaying && !hasEnded
                  ? 'translate-y-2 opacity-0 blur-[2px]'
                  : 'translate-y-0 opacity-100 blur-0'
              }`}
            >
              a quiet record of becoming. some moments i kept, and the small
              truths they left behind.
            </p>
          </aside>

          <div
            className={`order-1 justify-self-center md:order-2 md:justify-self-end ${
              isVideoFocused ? 'relative z-30' : ''
            }`}
          >
            <div
              className={`video-shell relative aspect-square w-[min(88vw,72dvh,640px)] overflow-hidden bg-[#090909] transition-[box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
                  captureStill()
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
                  className="absolute bottom-4 right-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-[#050505]/35 text-stone-100/75 backdrop-blur-sm transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#050505]/55 hover:text-stone-100 active:translate-y-[1px]"
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
        className="relative mx-auto grid min-h-[72dvh] w-full max-w-[1400px] items-center overflow-hidden px-4 py-20 sm:px-6 md:grid-cols-[0.74fr_1fr] md:px-10"
      >
        {stillFrame && (
          <div
            className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ opacity: hasEnded ? 1 : 0 }}
            aria-hidden="true"
          >
            <img
              src={stillFrame}
              alt=""
              className="h-full w-full scale-105 object-cover opacity-[0.18] blur-[2px] grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505]/65 to-[#050505]/90" />
          </div>
        )}

        <div className="relative z-10 hidden font-stoke text-[0.68rem] lowercase tracking-[0.2em] text-stone-600 md:block">
          {hasEnded ? 'the note' : 'developing'}
        </div>
        <div className="relative z-10">
          <p
            className="font-crimson text-[clamp(1.9rem,6vw,5.9rem)] font-normal leading-[1.04] tracking-[0] text-stone-100 transition-[filter,opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:leading-[0.96]"
            style={{
              filter: `blur(${(1 - develop) * 10}px)`,
              opacity: 0.1 + develop * 0.9,
              transform: `translateY(${(1 - develop) * 24}px)`,
            }}
          >
            {note}
          </p>
          <div
            className="mt-10 flex flex-wrap gap-3 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
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
      </section>
    </main>
  )
}

export default App
