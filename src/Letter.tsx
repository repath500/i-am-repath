import { useEffect, useRef, useState } from 'react'
import {
  fadeVolume,
  MUSIC_AMBIENT,
  OUTRO_SRC,
  duckMusicForSpeech,
  startAmbientMusic,
} from './audioConfig'
import {
  addLetter,
  formatLetterDate,
  getDueLetters,
  getUpcomingLetters,
  isLetterDue,
  loadLetters,
  markLetterOpened,
  minDeliveryDate,
  type SavedLetter,
} from './letters'
import MusicMute from './MusicMute'
import { navigate } from './router'
import { useMusicMuted } from './useMusicMuted'

type LetterProps = {
  deliveryId?: string
}

const speakWithBrowser = (text: string) => {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.92
  utterance.pitch = 0.85
  window.speechSynthesis.speak(utterance)
}

function Letter({ deliveryId }: LetterProps) {
  const [draft, setDraft] = useState('')
  const [deliverAt, setDeliverAt] = useState(minDeliveryDate())
  const [saved, setSaved] = useState(false)
  const [, setRevision] = useState(0)
  const [activeDelivery, setActiveDelivery] = useState<SavedLetter | null>(null)
  const [reading, setReading] = useState(false)
  const [soundBlocked, setSoundBlocked] = useState(false)
  const { musicMuted, toggleMusicMuted } = useMusicMuted()
  const musicRef = useRef<HTMLAudioElement>(null)
  const narrationRef = useRef<HTMLAudioElement>(null)
  const musicMutedRef = useRef(musicMuted)

  musicMutedRef.current = musicMuted

  const refreshLetters = () => setRevision((value) => value + 1)

  useEffect(() => {
    const due = getDueLetters()
    if (deliveryId) {
      const match = loadLetters().find((letter) => letter.id === deliveryId)
      if (match && isLetterDue(match)) {
        setActiveDelivery(match)
        markLetterOpened(match.id)
        refreshLetters()
      }
      return
    }

    const unopened = due.find((letter) => !letter.openedAt)
    if (unopened) {
      setActiveDelivery(unopened)
      markLetterOpened(unopened.id)
      refreshLetters()
    }
  }, [deliveryId])

  useEffect(() => {
    const audio = musicRef.current
    if (!audio) return

    if (musicMuted) {
      fadeVolume(audio, 0, 700)
      return
    }

    startAmbientMusic(audio)
      .then(() => setSoundBlocked(false))
      .catch(() => setSoundBlocked(true))

    return () => {
      audio.pause()
      audio.currentTime = 0
      audio.volume = 0
    }
  }, [musicMuted])

  const restoreMusic = () => {
    if (musicMutedRef.current) return
    const music = musicRef.current
    if (music) fadeVolume(music, MUSIC_AMBIENT, 900)
  }

  const listenToLetter = async (text: string) => {
    if (reading) {
      narrationRef.current?.pause()
      window.speechSynthesis?.cancel()
      setReading(false)
      restoreMusic()
      return
    }

    setReading(true)
    duckMusicForSpeech(musicRef.current, musicMutedRef.current)

    try {
      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const narration = narrationRef.current
        if (!narration) throw new Error('no audio')

        narration.src = url
        narration.onended = () => {
          URL.revokeObjectURL(url)
          setReading(false)
          restoreMusic()
        }
        narration.onerror = () => {
          URL.revokeObjectURL(url)
          setReading(false)
          restoreMusic()
        }
        await narration.play()
        return
      }
    } catch {
      // fall through to browser speech
    }

    speakWithBrowser(text)
    window.setTimeout(() => {
      setReading(false)
      restoreMusic()
    }, Math.min(120_000, text.length * 80))
  }

  const schedule = () => {
    const text = draft.trim()
    if (!text || !deliverAt) return

    addLetter(text, deliverAt)
    refreshLetters()
    setDraft('')
    setDeliverAt(minDeliveryDate())
    setSaved(true)
  }

  const upcoming = getUpcomingLetters()
  const due = getDueLetters().filter((letter) => letter.openedAt)

  if (activeDelivery) {
    return (
      <main className="relative flex min-h-[100dvh] items-center bg-[#050505] px-5 py-16 text-stone-100 sm:px-6">
        <audio ref={musicRef} src={OUTRO_SRC} preload="auto" loop />
        <audio ref={narrationRef} preload="none" />
        <div className="pointer-events-none fixed inset-0 grain opacity-[0.13]" />

        <div className="relative mx-auto w-full max-w-[680px]">
          <p className="font-stoke text-[0.62rem] lowercase tracking-[0.22em] text-stone-600">
            from past you · {formatLetterDate(activeDelivery.deliverAt)}
          </p>
          <p className="mt-8 font-crimson text-[clamp(1.35rem,4.5vw,2rem)] leading-[1.42] text-stone-100">
            {activeDelivery.text}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => listenToLetter(activeDelivery.text)}
              className="font-stoke text-[0.58rem] lowercase tracking-[0.16em] text-stone-500 transition duration-300 hover:text-stone-200"
            >
              {reading ? 'reading' : 'listen'}
            </button>
            <button
              type="button"
              onClick={() => setActiveDelivery(null)}
              className="font-stoke text-[0.58rem] lowercase tracking-[0.16em] text-stone-600 transition duration-300 hover:text-stone-300"
            >
              close
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-[100dvh] overflow-y-auto bg-[#050505] text-stone-100">
      <audio ref={musicRef} src={OUTRO_SRC} preload="auto" loop />
      <audio ref={narrationRef} preload="none" />
      <div className="pointer-events-none fixed inset-0 grain opacity-[0.13]" />

      {soundBlocked && !musicMuted && (
        <button
          type="button"
          onClick={() => {
            const audio = musicRef.current
            if (!audio) return
            startAmbientMusic(audio)
              .then(() => setSoundBlocked(false))
              .catch(() => setSoundBlocked(true))
          }}
          className="fixed bottom-5 right-5 z-20 border border-white/15 bg-stone-100 px-4 py-2 font-stoke text-xs lowercase text-[#050505] transition duration-300 hover:bg-white active:translate-y-[1px]"
        >
          tap for sound
        </button>
      )}

      <div className="relative mx-auto w-full max-w-[760px] px-5 py-12 sm:px-6 md:py-20">
        <a
          href="/"
          onClick={(event) => {
            event.preventDefault()
            navigate('/')
          }}
          className="inline-flex items-center gap-2 font-stoke text-[0.7rem] lowercase tracking-[0.18em] text-stone-500 transition duration-300 hover:text-stone-100"
        >
          <span aria-hidden="true">&larr;</span>
          repath
        </a>

        <header className="mt-12 md:mt-16">
          <h1 className="font-stoke text-[clamp(2.2rem,8vw,4.5rem)] font-light lowercase leading-none tracking-[-0.01em] text-stone-100">
            letter
          </h1>
          <p className="mt-5 max-w-[46ch] font-crimson text-lg italic leading-[1.5] text-stone-500 md:text-xl">
            write something for the version of you that hasn&apos;t arrived yet.
            it waits on your device until the day you chose.
          </p>
        </header>

        {saved ? (
          <div className="mt-12 border-t border-white/10 pt-10">
            <p className="font-crimson text-[1.5rem] italic leading-[1.4] text-stone-300 md:text-[1.7rem]">
              sealed. it&apos;ll find you when the date comes.
            </p>
            <button
              type="button"
              onClick={() => setSaved(false)}
              className="mt-5 font-stoke text-[0.7rem] lowercase tracking-[0.14em] text-stone-500 transition duration-300 hover:text-stone-100"
            >
              write another
            </button>
          </div>
        ) : (
          <section className="mt-12 border-t border-white/10 pt-10">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={4}
              placeholder="dear future me —"
              className="w-full resize-none border-b border-white/12 bg-transparent pb-3 font-crimson text-[1.35rem] leading-[1.45] text-stone-200 outline-none transition-colors duration-300 placeholder:text-stone-600 focus:border-white/30 md:text-[1.5rem]"
            />
            <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <label className="flex flex-col gap-2 font-stoke text-[0.62rem] lowercase tracking-[0.18em] text-stone-600">
                deliver on
                <input
                  type="date"
                  value={deliverAt}
                  min={minDeliveryDate()}
                  onChange={(event) => setDeliverAt(event.target.value)}
                  className="border border-white/12 bg-transparent px-3 py-2 font-stoke text-[0.72rem] tracking-[0.12em] text-stone-300 outline-none transition focus:border-white/30"
                />
              </label>
              <button
                type="button"
                onClick={schedule}
                disabled={draft.trim().length === 0}
                className="border border-white/15 bg-stone-100 px-6 py-3 font-stoke text-[0.72rem] lowercase tracking-[0.12em] text-[#050505] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40"
              >
                seal it
              </button>
            </div>
          </section>
        )}

        {(upcoming.length > 0 || due.length > 0) && (
          <section className="mt-14 border-t border-white/10 pt-10">
            {upcoming.length > 0 && (
              <div>
                <p className="font-stoke text-[0.62rem] lowercase tracking-[0.22em] text-stone-600">
                  waiting
                </p>
                <ul className="mt-4 space-y-4">
                  {upcoming.map((letter) => (
                    <li
                      key={letter.id}
                      className="border-b border-white/10 pb-4"
                    >
                      <span className="font-stoke text-[0.58rem] lowercase tracking-[0.16em] text-stone-600">
                        {formatLetterDate(letter.deliverAt)}
                      </span>
                      <p className="mt-2 font-crimson text-[1.05rem] italic leading-[1.4] text-stone-600">
                        sealed until then
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {due.length > 0 && (
              <div className={upcoming.length > 0 ? 'mt-10' : ''}>
                <p className="font-stoke text-[0.62rem] lowercase tracking-[0.22em] text-stone-600">
                  opened
                </p>
                <ul className="mt-4 space-y-4">
                  {due.map((letter) => (
                    <li key={letter.id}>
                      <button
                        type="button"
                        onClick={() => setActiveDelivery(letter)}
                        className="text-left font-crimson text-[1.05rem] leading-[1.4] text-stone-400 transition hover:text-stone-200"
                      >
                        {formatLetterDate(letter.deliverAt)} · read again
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        <footer className="mt-16 flex flex-col gap-5 border-t border-white/10 pt-6 font-stoke text-[0.68rem] lowercase tracking-[0.14em] text-stone-500 md:flex-row md:items-center md:justify-between md:gap-4">
          <nav className="flex flex-col gap-2 md:flex-row md:items-center md:gap-2">
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
            <span className="hidden text-white/15 md:inline" aria-hidden="true">
              |
            </span>
            <a
              href="/"
              onClick={(event) => {
                event.preventDefault()
                navigate('/')
              }}
              className="transition hover:text-stone-100"
            >
              home
            </a>
          </nav>
          <MusicMute muted={musicMuted} onToggle={toggleMusicMuted} />
        </footer>
      </div>
    </main>
  )
}

export default Letter
