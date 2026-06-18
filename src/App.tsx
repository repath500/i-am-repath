import { useEffect, useRef, useState } from 'react'

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
  { id: 'seven', src: '/web-videos/7.mp4', title: 'alone' },
  { id: 'eight', src: '/web-videos/8.mp4', title: 'mistakes' },
]

const notes: string[] = [
  'kindness is the sharpest thing i know. not softness, not the wish to be liked, but a steady decision to leave people lighter than i found them, even on the days no one would blame me for being colder.',
  'who you are when no one is watching slowly becomes the whole shape of your life. the private self is the real one. everything else is just the part of it the world happens to see.',
  'patience has a sound, and most days it is quiet. it is the breath you take before answering, the word you keep, the small refusal to rush a thing that was never yours to rush.',
  'you do not become yourself all at once. you choose it in small rooms, in unanswered messages, in the seconds you could have been crueler and were not. character is the sum of those invisible choices.',
  'remember the ordinary parts too. the walk home, the light through a window, the laugh after a hard week. most of a life is not the milestones. it is the quiet middle nobody photographs.',
  'motivation visits. resolve stays. one is a feeling that comes and goes with the weather, the other is a promise you keep to yourself long after the feeling has left the room.',
  'care is not only what you feel. it is what you protect when it is inconvenient, what you repair when it is easier to replace, what you refuse to make worse just because you could.',
  'i am still becoming. less noise, more truth. less performance, more presence. i would rather be slowly honest than quickly admired, and i am learning the difference between the two.',
  'some mornings nothing has changed except you. same room, same weight, same unfinished life, and yet you wake up remembering you are allowed to be glad anyway. that is its own quiet kind of strength.',
  'the version of you that kept going through the worst of it is not a smaller, broken version. it is the truest one you have. do not be ashamed of who you had to become to survive.',
  'nobody warns you that healing is boring. it is the same kitchen, the same doubts, the same familiar fears, lived through again and again until one day they are quieter, and you are less afraid without knowing when it happened.',
  'life moves in seasons that never ask your permission. there are springs you did nothing to earn and winters you did nothing to deserve. you are allowed to be tired in all of them.',
  'you have already survived every single day you once swore you could not. that is not a small thing. that is a long, unbroken record of a person who kept getting back up when no one was counting.',
  'there is still time to become the person you needed when you were younger. you cannot go back and rescue that version of you, but you can make sure no one else has to face it as alone as you did.',
  'some grief does not leave. you do not get over the people and the years you lose. you just slowly learn to carry them in a way that no longer decides where you walk.',
  'a soft life is not a weak one. rest is not the opposite of ambition, it is the thing that makes ambition survivable. you are allowed to build a life that is gentle on the person living it.',
  'what you repeat in private becomes what people trust in public. reputation is just the echo of a thousand small moments no one saw. build something honest in the quiet, and the rest takes care of itself.',
  'you are not behind. there is no schedule you were handed at birth, no race that everyone else secretly understood. you are on your own clock, and against all the noise, it is still ticking forward.',
  'it is okay if today was only survival. not every day has to be progress. sometimes staying, breathing, and refusing to disappear is the entire achievement, and it is enough.',
  'joy does not have to be loud to count. a warm cup, a message answered, a window of late light across the floor. learn to notice the small good things, because they are most of the good there is.',
  'the hard days are not proof that you are failing. sometimes the world is simply heavy, the timing is wrong, and the weight is real. you can be doing everything right and still be tired. you are still here, and that matters.',
  'you do not need to have it all figured out to keep moving. clarity usually arrives after the step, not before it. faith is just walking toward a door you cannot yet see open.',
  'being gentle with yourself is not giving up. it is how you stay in the fight long enough to actually win it. you cannot punish yourself into becoming someone you would be proud of.',
  'one honest conversation can undo weeks of silence. so much distance is just two people each waiting for the other to reach first. be the one who reaches. it costs less than the silence does.',
  'you are allowed to outgrow what once saved you. the habits, the people, the versions of yourself that got you here. letting go of them is not betrayal. it is the quiet proof that you have grown.',
  'fuck partying. fuck clubs. fuck the noise that makes you feel alive for an hour and empty for a week. i just want a slow morning, one person who stays, work that means something, and a life that does not need a crowd to prove it happened.',
  'some days i am tired of performing happiness. fuck pretending i am fine because the room expects it. i want truth more than i want comfort, even when truth is just admitting i am lonely, angry, or not where i thought i would be by now.',
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

const pickNote = (exclude?: string) => {
  const pool = exclude ? notes.filter((item) => item !== exclude) : notes
  return pool[Math.floor(Math.random() * pool.length)]
}

function App() {
  const frameQueueRef = useRef<Frame[]>([])
  const [frame, setFrame] = useState<Frame>(() => {
    const queue = makeFrameQueue()
    const first = queue.shift() as Frame
    frameQueueRef.current = queue
    return first
  })
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
    setFrame((current) => {
      if (frameQueueRef.current.length === 0) {
        frameQueueRef.current = makeFrameQueue(current.id)
      }
      return frameQueueRef.current.shift() as Frame
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
            <p className="font-crimson text-xl italic leading-[1.18] text-stone-400">
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

        <footer className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 border-t border-white/10 pt-4 font-stoke text-[0.68rem] lowercase tracking-[0.14em] text-stone-500">
          <span>2026</span>
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
            className="font-crimson text-[clamp(2.15rem,6vw,5.9rem)] font-normal leading-[0.96] tracking-[0] text-stone-100 transition-[filter,opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
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
