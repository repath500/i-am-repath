import { useEffect, useMemo, useRef, useState } from 'react'
import {
  fadeVolume,
  MUSIC_AMBIENT,
  MUSIC_NARRATION_DUCK,
  OUTRO_SRC,
  startAmbientMusic,
} from './audioConfig'
import MusicMute from './MusicMute'
import { notes } from './notes'
import type { Mood } from './notes'
import { navigate } from './router'
import { useMusicMuted } from './useMusicMuted'
import { getNoteVoiceSrc, voiceLabels } from './voices'

// Set this to your email to have submissions open the visitor's mail app
// pre-filled. Leave empty to quietly collect them in the visitor's browser.
const SUBMIT_EMAIL = ''
const SUBMIT_STORAGE_KEY = 'repath:submissions:v1'

type Filter = 'all' | Mood

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'all' },
  { id: 'light', label: 'light' },
  { id: 'soft', label: 'soft' },
  { id: 'heavy', label: 'heavy' },
]

const moodLabel: Record<Mood, string> = {
  light: 'light',
  soft: 'soft',
  heavy: 'heavy',
}

function Notes() {
  const [filter, setFilter] = useState<Filter>('all')
  const [draft, setDraft] = useState('')
  const [sent, setSent] = useState(false)
  const [soundBlocked, setSoundBlocked] = useState(false)
  const { musicMuted, toggleMusicMuted } = useMusicMuted()
  const musicRef = useRef<HTMLAudioElement>(null)
  const narrationRef = useRef<HTMLAudioElement>(null)
  const musicMutedRef = useRef(musicMuted)
  const [narratingIndex, setNarratingIndex] = useState<number | null>(null)

  musicMutedRef.current = musicMuted

  const restoreMusic = () => {
    if (musicMutedRef.current) return
    const music = musicRef.current
    if (music) fadeVolume(music, MUSIC_AMBIENT, 900)
  }

  const stopNarration = () => {
    const narration = narrationRef.current
    if (narration) {
      narration.pause()
      narration.currentTime = 0
      narration.onended = null
      narration.onerror = null
    }
    setNarratingIndex(null)
    restoreMusic()
  }

  const listenToNote = (index: number) => {
    const narration = narrationRef.current
    const src = getNoteVoiceSrc(index)
    if (!narration || !src) return

    if (narratingIndex === index) {
      stopNarration()
      return
    }

    narration.pause()
    narration.currentTime = 0
    narration.src = src
    narration.volume = 1
    setNarratingIndex(index)

    narration.onended = () => {
      setNarratingIndex(null)
      restoreMusic()
    }

    narration.onerror = () => {
      setNarratingIndex(null)
      restoreMusic()
    }

    if (!musicMutedRef.current) {
      const music = musicRef.current
      if (music) fadeVolume(music, MUSIC_NARRATION_DUCK, 700)
    }

    narration.play().catch(() => {
      setNarratingIndex(null)
      restoreMusic()
    })
  }

  useEffect(() => () => stopNarration(), [])

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

  const enableSound = () => {
    if (musicMuted) return
    const audio = musicRef.current
    if (!audio) return
    startAmbientMusic(audio)
      .then(() => setSoundBlocked(false))
      .catch(() => setSoundBlocked(true))
  }

  const visible = useMemo(
    () =>
      notes
        .map((note, index) => ({ ...note, index }))
        .filter((note) => filter === 'all' || note.mood === filter),
    [filter],
  )

  const submit = () => {
    const text = draft.trim()
    if (!text) return

    if (SUBMIT_EMAIL) {
      const subject = encodeURIComponent('a note')
      const body = encodeURIComponent(text)
      window.location.href = `mailto:${SUBMIT_EMAIL}?subject=${subject}&body=${body}`
    } else {
      try {
        const raw = window.localStorage.getItem(SUBMIT_STORAGE_KEY)
        const list = raw ? (JSON.parse(raw) as string[]) : []
        list.push(text)
        window.localStorage.setItem(SUBMIT_STORAGE_KEY, JSON.stringify(list))
      } catch {
        // storage unavailable — still acknowledge the gesture
      }
    }

    setDraft('')
    setSent(true)
  }

  return (
    <main className="relative h-[100dvh] overflow-y-auto bg-[#050505] text-stone-100">
      <audio ref={musicRef} src={OUTRO_SRC} preload="auto" loop />
      <audio ref={narrationRef} preload="none" />
      <div className="pointer-events-none fixed inset-0 grain opacity-[0.13]" />

      {soundBlocked && !musicMuted && (
        <button
          type="button"
          onClick={enableSound}
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
          <h1 className="font-stoke text-[clamp(2.6rem,9vw,5rem)] font-light lowercase leading-none tracking-[-0.01em] text-stone-100">
            notes
          </h1>
          <p className="mt-5 max-w-[46ch] font-crimson text-lg italic leading-[1.5] text-stone-500 md:text-xl">
            a quiet record of becoming. the small truths i kept, gathered in one
            place.
          </p>
          <p className="mt-4 font-stoke text-[0.66rem] lowercase tracking-[0.2em] text-stone-600">
            {notes.length} entries
          </p>
        </header>

        <div className="mt-10 flex flex-wrap gap-2.5 border-t border-white/10 pt-8">
          {filters.map((item) => {
            const active = item.id === filter
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                aria-pressed={active}
                className={`border px-4 py-2 font-stoke text-[0.7rem] lowercase tracking-[0.12em] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:translate-y-[1px] ${
                  active
                    ? 'border-white/15 bg-stone-100 text-[#050505]'
                    : 'border-white/12 text-stone-400 hover:border-white/30 hover:text-stone-100'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        <ol className="mt-2 divide-y divide-white/10">
          {visible.map((note, position) => (
            <li
              key={note.index}
              className="note-row flex flex-col gap-3 py-9 md:flex-row md:gap-10"
              style={{ animationDelay: `${Math.min(position * 45, 540)}ms` }}
            >
              <div className="flex shrink-0 flex-col gap-3 md:w-24">
                <div className="flex items-baseline gap-3 md:flex-col md:items-start md:gap-2">
                  <span className="font-stoke text-[0.7rem] tabular-nums tracking-[0.1em] text-stone-600">
                    {String(note.index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-stoke text-[0.6rem] lowercase tracking-[0.22em] text-stone-500">
                    {moodLabel[note.mood]} · {voiceLabels[note.voice]}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => listenToNote(note.index)}
                  className="self-start font-stoke text-[0.58rem] lowercase tracking-[0.16em] text-stone-600 transition duration-300 hover:text-stone-200"
                >
                  {narratingIndex === note.index ? 'reading' : 'listen'}
                </button>
              </div>
              <p className="font-crimson text-[1.4rem] font-normal leading-[1.42] text-stone-200 md:text-[1.6rem]">
                {note.text}
              </p>
            </li>
          ))}
        </ol>

        <section className="mt-2 border-t border-white/10 py-12 md:py-16">
          <p className="font-stoke text-[0.62rem] lowercase tracking-[0.22em] text-stone-600">
            leave one
          </p>
          {sent ? (
            <div className="mt-5">
              <p className="font-crimson text-[1.5rem] italic leading-[1.4] text-stone-300 md:text-[1.7rem]">
                thank you. that meant something.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-5 font-stoke text-[0.7rem] lowercase tracking-[0.14em] text-stone-500 transition duration-300 hover:text-stone-100"
              >
                write another
              </button>
            </div>
          ) : (
            <div className="mt-5">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={3}
                placeholder="anything — a truth you carry, something you needed to hear, a line that stayed with you."
                className="w-full resize-none border-b border-white/12 bg-transparent pb-3 font-crimson text-[1.35rem] leading-[1.45] text-stone-200 outline-none transition-colors duration-300 placeholder:text-stone-600 focus:border-white/30 md:text-[1.5rem]"
              />
              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="font-stoke text-[0.6rem] lowercase tracking-[0.18em] text-stone-600">
                  unsigned, unedited
                </span>
                <button
                  type="button"
                  onClick={submit}
                  disabled={draft.trim().length === 0}
                  className="border border-white/15 bg-stone-100 px-6 py-3 font-stoke text-[0.72rem] lowercase tracking-[0.12em] text-[#050505] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  send
                </button>
              </div>
            </div>
          )}
        </section>

        <footer className="flex items-center justify-between gap-4 border-t border-white/10 pt-6 font-stoke text-[0.68rem] lowercase tracking-[0.14em] text-stone-500">
          <span className="flex items-center gap-2">
            <span>2026</span>
            <span className="text-white/15" aria-hidden="true">|</span>
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
          </span>
          <MusicMute muted={musicMuted} onToggle={toggleMusicMuted} />
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
      </div>
    </main>
  )
}

export default Notes
