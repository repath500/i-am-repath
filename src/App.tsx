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
  'kindness is still the sharpest thing i know. not soft, not naive, just a decision to leave people lighter than i found them.',
  'who you are when no one is watching becomes the shape of your whole life. i am trying to make that version honest.',
  'some days are just proof that patience has a sound. breathe, keep your word, and let the next right thing arrive cleanly.',
  'you do not become yourself all at once. you choose it in small rooms, in quiet replies, in the moment you could have been colder.',
  'i want to remember the ordinary parts too. the walk, the light, the laugh after a hard week. that is where most of life is hiding.',
  'motivation comes and goes. the deeper thing is resolve: a quiet promise to keep moving even when no one claps for it.',
  'care is not only what you feel. it is what you protect, what you repair, what you refuse to make worse.',
  'i am still becoming. less noise, more truth. less performance, more presence. more love in the places where it counts.',
  'some mornings nothing has changed except you remembered you are allowed to be glad anyway.',
  'the version of you that kept going through the worst days is not a smaller version. it is the realest one.',
  'nobody tells you that healing is boring. same kitchen, same doubts, same you — except slowly, quietly, less afraid.',
  'life has seasons that do not ask permission. you are allowed to be tired in all of them.',
  'you have already survived every bad day you swore you would not. that is not nothing. that is a whole life of proof.',
  'there is still time to become the person you needed when you were younger.',
  'some grief does not leave. you just learn to carry it without letting it steer.',
  'a soft life is not a weak one. rest is not the opposite of ambition.',
  'what you repeat in private becomes what people trust in public. build something honest there.',
  'you are not behind. you are on your own clock, and it still ticks.',
  'it is okay if today is only survival. survival is still a kind of courage.',
  'joy does not have to be loud to be real. a warm cup, a message back, a window of light — that counts.',
  'the hard days do not mean you are failing. sometimes the world is just heavy, and you are still here.',
  'you do not need to have it figured out to keep going. clarity often arrives after the step, not before it.',
  'being gentle with yourself is not giving up. it is how you stay in the fight long enough to win it.',
  'one honest conversation can undo weeks of silence. reach when you can.',
  'you are allowed to outgrow what once saved you. that is not betrayal. that is growth.',
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
  const [soundBlocked, setSoundBlocked] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const noteRef = useRef<HTMLElement>(null)

  const isVideoFocused = isPlaying && !hasEnded

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
    const timer = window.setTimeout(() => {
      playWithSound()
        .then(() => setSoundBlocked(false))
        .catch(() => setSoundBlocked(true))
    }, 1900)

    return () => window.clearTimeout(timer)
  }, [frame])

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
    video.currentTime = 0
    playWithSound().catch(() => setSoundBlocked(true))
  }

  const chooseAnother = () => {
    setHasEnded(false)
    setIsPlaying(false)
    setIsReady(false)
    setSoundBlocked(false)
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

  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden bg-[#050505] text-stone-100">
      <div className="pointer-events-none fixed inset-0 grain opacity-[0.13]" />
      <div
        className={`pointer-events-none fixed inset-0 z-20 bg-[#050505]/75 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVideoFocused ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />
      <section className="relative grid min-h-[100dvh] grid-cols-1 content-between px-4 py-5 sm:px-6 md:px-10 md:py-8">
        <div className="intro-title pointer-events-none fixed inset-0 grid place-items-center">
          <p className="font-stoke text-[clamp(2.2rem,8vw,7.5rem)] font-light lowercase tracking-[0] text-stone-100">
            i am repath
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-[1400px] flex-1 items-center gap-8 py-12 md:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.68fr)] md:gap-12 md:py-6">
          <aside className="order-2 hidden max-w-[38ch] self-end pb-8 md:block">
            <p className="font-crimson text-xl leading-[1.18] text-stone-400">
              instructions — each visit opens on a different frame. let it play
              once, then read on.
            </p>
          </aside>

          <div
            className={`order-1 justify-self-center md:order-2 md:justify-self-end ${
              isVideoFocused ? 'relative z-30' : ''
            }`}
          >
            <div className="video-shell relative aspect-square w-[min(88vw,72dvh,640px)] overflow-hidden border border-white/10 bg-[#090909] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              {!isReady && (
                <div className="absolute inset-0 skeleton" aria-hidden="true" />
              )}
              <video
                key={frame.id}
                ref={videoRef}
                className={`h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isReady ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.015]'
                }`}
                playsInline
                preload="auto"
                controls={false}
                onCanPlay={() => {
                  setIsReady(true)
                  if (videoRef.current) videoRef.current.muted = false
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => {
                  setIsPlaying(false)
                  setHasEnded(true)
                }}
              >
                <source src={frame.src} />
              </video>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050505]/80 to-transparent" />

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
        className={`relative mx-auto grid min-h-[72dvh] w-full max-w-[1400px] items-center px-4 py-20 transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-6 md:grid-cols-[0.74fr_1fr] md:px-10 ${
          hasEnded ? 'opacity-100 translate-y-0' : 'opacity-35 translate-y-8'
        }`}
      >
        <div className="hidden font-stoke text-[0.68rem] lowercase tracking-[0.2em] text-stone-600 md:block">
          instructions
        </div>
        <div>
          <p className="font-crimson text-[clamp(2.15rem,6vw,5.9rem)] font-normal leading-[0.96] tracking-[0] text-stone-100">
            {note}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
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
