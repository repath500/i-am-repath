import { useEffect, useRef, useState } from 'react'

type Film = {
  id: string
  src: string
  note: string
  theme: string
}

const films: Film[] = [
  {
    id: 'one',
    src: '/web-videos/1.mp4',
    theme: 'kindness',
    note:
      'kindness is still the sharpest thing i know. not soft, not naive, just a decision to leave people lighter than i found them.',
  },
  {
    id: 'two',
    src: '/web-videos/2.mp4',
    theme: 'private character',
    note:
      'who you are when no one is watching becomes the shape of your whole life. i am trying to make that version honest.',
  },
  {
    id: 'three',
    src: '/web-videos/3.mp4',
    theme: 'patience',
    note:
      'some days are just proof that patience has a sound. breathe, keep your word, and let the next right thing arrive cleanly.',
  },
  {
    id: 'four',
    src: '/web-videos/4.mp4',
    theme: 'choice',
    note:
      'you do not become yourself all at once. you choose it in small rooms, in quiet replies, in the moment you could have been colder.',
  },
  {
    id: 'five',
    src: '/web-videos/5.mp4',
    theme: 'gratitude',
    note:
      'i want to remember the ordinary parts too. the walk, the light, the laugh after a hard week. that is where most of life is hiding.',
  },
  {
    id: 'six',
    src: '/web-videos/6.mp4',
    theme: 'resolve',
    note:
      'motivation comes and goes. the deeper thing is resolve: a quiet promise to keep moving even when no one claps for it.',
  },
  {
    id: 'seven',
    src: '/web-videos/7.mp4',
    theme: 'care',
    note:
      'care is not only what you feel. it is what you protect, what you repair, what you refuse to make worse.',
  },
  {
    id: 'eight',
    src: '/web-videos/8.mp4',
    theme: 'becoming',
    note:
      'i am still becoming. less noise, more truth. less performance, more presence. more love in the places where it counts.',
  },
]

const pickFilm = () => films[Math.floor(Math.random() * films.length)]

function App() {
  const [film, setFilm] = useState<Film>(() => pickFilm())
  const [hasEnded, setHasEnded] = useState(false)
  const [soundBlocked, setSoundBlocked] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const noteRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      videoRef.current
        ?.play()
        .then(() => setSoundBlocked(false))
        .catch(() => setSoundBlocked(true))
    }, 1900)

    return () => window.clearTimeout(timer)
  }, [film])

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
    video.muted = false
    video.play().catch(() => setSoundBlocked(true))
  }

  const chooseAnother = () => {
    setHasEnded(false)
    setIsReady(false)
    setSoundBlocked(false)
    setFilm((current) => {
      const nextFilms = films.filter((item) => item.id !== current.id)
      return nextFilms[Math.floor(Math.random() * nextFilms.length)]
    })
  }

  const enableSound = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = false
    video.play().then(() => setSoundBlocked(false))
  }

  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden bg-[#050505] text-stone-100">
      <div className="pointer-events-none fixed inset-0 grain opacity-[0.13]" />
      <section className="relative grid min-h-[100dvh] grid-cols-1 content-between px-4 py-5 sm:px-6 md:px-10 md:py-8">
        <div className="intro-title pointer-events-none fixed inset-0 grid place-items-center">
          <p className="font-stoke text-[clamp(2.2rem,8vw,7.5rem)] font-light lowercase tracking-[0] text-stone-100">
            i am repath
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-[1400px] flex-1 items-center gap-8 py-12 md:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.68fr)] md:gap-12 md:py-6">
          <aside className="order-2 hidden max-w-[38ch] self-end pb-8 md:block">
            <p className="font-crimson text-xl leading-[1.18] text-stone-400">
              each visit opens on a different private frame. let it play once,
              then stay for the note.
            </p>
          </aside>

          <div className="order-1 justify-self-center md:order-2 md:justify-self-end">
            <div className="video-shell relative aspect-square w-[min(88vw,72dvh,640px)] overflow-hidden border border-white/10 bg-[#090909] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              {!isReady && (
                <div className="absolute inset-0 skeleton" aria-hidden="true" />
              )}
              <video
                key={film.id}
                ref={videoRef}
                className={`h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isReady ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.015]'
                }`}
                playsInline
                preload="auto"
                controls={false}
                onCanPlay={() => setIsReady(true)}
                onEnded={() => setHasEnded(true)}
              >
                <source src={film.src} />
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
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 font-stoke text-[0.68rem] lowercase tracking-[0.18em] text-stone-500">
              <span>{film.theme}</span>
              <span>{hasEnded ? 'ended' : 'playing once'}</span>
            </div>
          </div>
        </div>

        <footer className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 border-t border-white/10 pt-4 font-stoke text-[0.68rem] lowercase tracking-[0.14em] text-stone-500">
          <span>2026</span>
          <a
            href="https://www.linkedin.com/in/repathkhan/"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-stone-100"
          >
            credit repath khan
          </a>
        </footer>
      </section>

      <section
        ref={noteRef}
        className={`relative mx-auto grid min-h-[72dvh] w-full max-w-[1400px] items-center px-4 py-20 transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-6 md:grid-cols-[0.74fr_1fr] md:px-10 ${
          hasEnded ? 'opacity-100 translate-y-0' : 'opacity-35 translate-y-8'
        }`}
      >
        <div className="hidden font-stoke text-[0.68rem] lowercase tracking-[0.2em] text-stone-600 md:block">
          note after the film
        </div>
        <div>
          <p className="font-crimson text-[clamp(2.15rem,6vw,5.9rem)] font-normal leading-[0.96] tracking-[0] text-stone-100">
            {film.note}
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
              another film
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
