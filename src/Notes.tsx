import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  fadeVolume,
  MUSIC_AMBIENT,
  OUTRO_SRC,
  duckMusicForSpeech,
  startAmbientMusic,
} from './audioConfig'
import MusicMute from './MusicMute'
import PresenceWhisper from './PresenceWhisper'
import { hiddenNote } from './hiddenContent'
import { notes } from './notes'
import type { Mood } from './notes'
import {
  allNotesComplete,
  markNoteComplete,
  useProgressListener,
} from './progress'
import { getNoteSharePath, navigate } from './router'
import { resetSiteMeta, shareNote, updateNoteMeta } from './share'
import { useMusicMuted } from './useMusicMuted'
import { getNoteVoiceSrc } from './voices'

// Visitor submissions are saved to Upstash via /api/notes

const HIDDEN_INDEX = 31

type DisplayNote = {
  text: string
  mood: Mood
  index: number
  hidden?: boolean
}
type Filter = 'all' | Mood
type ViewMode = 'list' | 'feed'

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

const getFeedTypography = (text: string) => {
  const length = text.length
  if (length > 320) {
    return { fontSize: 'clamp(1.15rem, 4.2vw, 1.55rem)', lineHeight: 1.34 }
  }
  if (length > 240) {
    return { fontSize: 'clamp(1.25rem, 4.8vw, 1.75rem)', lineHeight: 1.3 }
  }
  if (length > 160) {
    return { fontSize: 'clamp(1.45rem, 5.4vw, 2rem)', lineHeight: 1.26 }
  }
  if (length > 100) {
    return { fontSize: 'clamp(1.65rem, 6vw, 2.35rem)', lineHeight: 1.22 }
  }
  return { fontSize: 'clamp(1.85rem, 6.8vw, 2.75rem)', lineHeight: 1.18 }
}

function Notes({ initialNoteIndex }: { initialNoteIndex?: number }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [viewMode, setViewMode] = useState<ViewMode>(
    initialNoteIndex !== undefined ? 'feed' : 'list',
  )
  const [draft, setDraft] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [soundBlocked, setSoundBlocked] = useState(false)
  const [copiedShare, setCopiedShare] = useState<number | null>(null)
  const { musicMuted, toggleMusicMuted } = useMusicMuted()
  const musicRef = useRef<HTMLAudioElement>(null)
  const narrationRef = useRef<HTMLAudioElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<Map<number, HTMLElement>>(new Map())
  const visibleRatiosRef = useRef<Map<number, number>>(new Map())
  const musicMutedRef = useRef(musicMuted)
  const viewModeRef = useRef(viewMode)
  const visibleRef = useRef<{ index: number }[]>([])
  const activeScrollIndexRef = useRef<number | null>(null)
  const pendingScrollRef = useRef<number | null>(initialNoteIndex ?? null)
  const [narratingIndex, setNarratingIndex] = useState<number | null>(null)
  const [activeScrollIndex, setActiveScrollIndex] = useState<number | null>(null)
  const [unlockedHidden, setUnlockedHidden] = useState(allNotesComplete)

  const noteNumber = (note: DisplayNote) =>
    note.hidden ? '32' : String(note.index + 1).padStart(2, '0')

  musicMutedRef.current = musicMuted
  viewModeRef.current = viewMode

  useEffect(() => {
    return useProgressListener(() => setUnlockedHidden(allNotesComplete()))
  }, [])

  const catalog = useMemo((): DisplayNote[] => {
    const base: DisplayNote[] = notes.map((note, index) => ({ ...note, index }))
    if (unlockedHidden) {
      base.push({ ...hiddenNote, index: HIDDEN_INDEX, hidden: true })
    }
    return base
  }, [unlockedHidden])

  const visible = useMemo(
    () =>
      catalog.filter(
        (note) =>
          note.hidden || filter === 'all' || note.mood === filter,
      ),
    [catalog, filter],
  )

  visibleRef.current = visible

  const restoreMusic = () => {
    if (musicMutedRef.current) return
    const music = musicRef.current
    if (music) fadeVolume(music, MUSIC_AMBIENT, 900)
  }

  const stopNarration = useCallback(() => {
    const narration = narrationRef.current
    if (narration) {
      narration.pause()
      narration.currentTime = 0
      narration.onended = null
      narration.onerror = null
    }
    setNarratingIndex(null)
    restoreMusic()
  }, [])

  const advanceFeed = useCallback((currentIndex: number) => {
    const list = visibleRef.current
    const position = list.findIndex((note) => note.index === currentIndex)
    if (position < 0 || position >= list.length - 1) return

    const next = slideRefs.current.get(list[position + 1].index)
    next?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const playHiddenNote = useCallback(
    async (autoAdvance = false) => {
      const narration = narrationRef.current
      if (!narration) return

      narration.pause()
      setNarratingIndex(HIDDEN_INDEX)
      duckMusicForSpeech(musicRef.current, musicMutedRef.current)

      const finish = () => {
        setNarratingIndex(null)
        restoreMusic()
        if (autoAdvance && viewModeRef.current === 'feed') {
          advanceFeed(HIDDEN_INDEX)
        }
      }

      try {
        const response = await fetch('/api/speak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: hiddenNote.text }),
        })
        if (!response.ok) throw new Error('speak failed')
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        narration.src = url
        narration.onended = () => {
          URL.revokeObjectURL(url)
          finish()
        }
        narration.onerror = () => {
          URL.revokeObjectURL(url)
          finish()
        }
        await narration.play()
      } catch {
        finish()
      }
    },
    [advanceFeed],
  )

  const playNoteAtIndex = useCallback(
    (index: number, autoAdvance = false) => {
      if (index === HIDDEN_INDEX) {
        playHiddenNote(autoAdvance)
        return
      }

      const narration = narrationRef.current
      const src = getNoteVoiceSrc(index)
      if (!narration || !src) return

      narration.pause()
      narration.currentTime = 0
      narration.src = src
      narration.volume = 1
      setNarratingIndex(index)

      narration.onended = () => {
        setNarratingIndex(null)
        markNoteComplete(index)
        restoreMusic()
        if (autoAdvance && viewModeRef.current === 'feed') {
          advanceFeed(index)
        }
      }

      narration.onerror = () => {
        setNarratingIndex(null)
        restoreMusic()
      }

      duckMusicForSpeech(musicRef.current, musicMutedRef.current)

      narration.play().catch(() => {
        setNarratingIndex(null)
        restoreMusic()
      })
    },
    [advanceFeed, playHiddenNote],
  )

  const listenToNote = (index: number) => {
    if (narratingIndex === index) {
      stopNarration()
      return
    }
    playNoteAtIndex(index)
  }

  const handleShare = async (index: number) => {
    if (index === HIDDEN_INDEX) return
    const result = await shareNote(index)
    if (result === 'copied') {
      setCopiedShare(index)
      window.setTimeout(() => setCopiedShare(null), 2000)
    }
    window.history.replaceState({}, '', getNoteSharePath(index))
    updateNoteMeta(index)
  }

  useEffect(() => {
    if (initialNoteIndex === undefined) {
      resetSiteMeta()
      return
    }

    updateNoteMeta(initialNoteIndex)
    return () => resetSiteMeta()
  }, [initialNoteIndex])

  useEffect(() => {
    if (pendingScrollRef.current === null || viewMode !== 'feed') return

    const index = pendingScrollRef.current
    requestAnimationFrame(() => {
      const slide = slideRefs.current.get(index)
      if (slide) {
        slide.scrollIntoView({ block: 'start' })
        pendingScrollRef.current = null
      }
    })
  }, [viewMode, visible])

  useEffect(() => () => stopNarration(), [stopNarration])

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

  useEffect(() => {
    if (viewMode !== 'feed') {
      visibleRatiosRef.current.clear()
      setActiveScrollIndex(null)
      activeScrollIndexRef.current = null
      stopNarration()
      return
    }

    const root = scrollRef.current
    if (!root) return

    visibleRatiosRef.current.clear()
    activeScrollIndexRef.current = null
    setActiveScrollIndex(null)
    root.scrollTo({ top: 0 })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number((entry.target as HTMLElement).dataset.index)
          if (entry.isIntersecting) {
            visibleRatiosRef.current.set(index, entry.intersectionRatio)
          } else {
            visibleRatiosRef.current.delete(index)
          }
        })

        let bestIndex: number | null = null
        let bestRatio = 0
        visibleRatiosRef.current.forEach((ratio, index) => {
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestIndex = index
          }
        })

        if (bestIndex !== null && bestRatio >= 0.52) {
          setActiveScrollIndex(bestIndex)
        }
      },
      {
        root,
        threshold: Array.from({ length: 11 }, (_, step) => step / 10),
      },
    )

    slideRefs.current.forEach((slide) => observer.observe(slide))

    return () => {
      observer.disconnect()
      visibleRatiosRef.current.clear()
    }
  }, [viewMode, visible, stopNarration])

  useEffect(() => {
    if (viewMode !== 'feed' || activeScrollIndex === null || soundBlocked) return
    if (activeScrollIndexRef.current === activeScrollIndex) return

    activeScrollIndexRef.current = activeScrollIndex
    if (activeScrollIndex !== HIDDEN_INDEX) {
      markNoteComplete(activeScrollIndex)
    }
    playNoteAtIndex(activeScrollIndex, true)
  }, [viewMode, activeScrollIndex, soundBlocked, playNoteAtIndex])

  const enableSound = () => {
    if (musicMuted) return
    const audio = musicRef.current
    if (!audio) return
    startAmbientMusic(audio)
      .then(() => setSoundBlocked(false))
      .catch(() => setSoundBlocked(true))
  }

  const submit = async () => {
    const text = draft.trim()
    if (!text || submitting) return

    setSubmitting(true)
    setSubmitError(false)

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) throw new Error('save failed')

      setDraft('')
      setSent(true)
    } catch {
      setSubmitError(true)
    } finally {
      setSubmitting(false)
    }
  }

  const activeFeedPosition =
    activeScrollIndex === null
      ? 0
      : visible.findIndex((note) => note.index === activeScrollIndex) + 1

  const sharedChrome = (
    <>
      {soundBlocked && !musicMuted && (
        <button
          type="button"
          onClick={enableSound}
          className="fixed bottom-5 right-5 z-30 border border-white/15 bg-stone-100 px-4 py-2 font-stoke text-xs lowercase text-[#050505] transition duration-300 hover:bg-white active:translate-y-[1px]"
        >
          tap for sound
        </button>
      )}

      <div className="flex flex-wrap gap-2.5">
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
    </>
  )

  if (viewMode === 'feed') {
    return (
      <main className="relative h-[100dvh] overflow-hidden bg-[#050505] text-stone-100">
        <audio ref={musicRef} src={OUTRO_SRC} preload="auto" loop />
        <audio ref={narrationRef} preload="none" />
        <PresenceWhisper />
        <div className="pointer-events-none fixed inset-0 grain opacity-[0.13]" />

        <div className="pointer-events-none fixed inset-x-0 top-0 z-20 bg-gradient-to-b from-[#050505] via-[#050505]/90 to-transparent px-5 pb-16 pt-5 sm:px-6">
          <div className="pointer-events-auto mx-auto flex max-w-[760px] items-start justify-between gap-4">
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
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="font-stoke text-[0.58rem] lowercase tracking-[0.2em] text-stone-500 transition duration-300 hover:text-stone-200"
              >
                list
              </button>
              <MusicMute muted={musicMuted} onToggle={toggleMusicMuted} />
            </div>
          </div>
          <div className="pointer-events-auto mx-auto mt-5 max-w-[760px]">{sharedChrome}</div>
        </div>

        <div
          ref={scrollRef}
          className="notes-feed h-[100dvh] overflow-y-auto"
        >
          {visible.map((note) => {
            const typography = getFeedTypography(note.text)
            const isActive = activeScrollIndex === note.index

            return (
              <section
                key={note.index}
                ref={(element) => {
                  if (element) slideRefs.current.set(note.index, element)
                  else slideRefs.current.delete(note.index)
                }}
                data-index={note.index}
                className="notes-feed-slide relative flex h-[100dvh] items-center px-5 pb-24 pt-36 sm:px-6"
              >
                <div
                  className={`mx-auto w-full max-w-[680px] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-35 translate-y-2'
                  }`}
                >
                  <div className="mb-6 flex items-center gap-3 font-stoke text-[0.62rem] lowercase tracking-[0.22em] text-stone-600">
                    <span className="tabular-nums tracking-[0.1em]">
                      {noteNumber(note)}
                    </span>
                    <span className="text-white/15" aria-hidden="true">
                      ·
                    </span>
                    <span>{moodLabel[note.mood]}</span>
                    {narratingIndex === note.index && (
                      <>
                        <span className="text-white/15" aria-hidden="true">
                          ·
                        </span>
                        <span className="text-stone-500">reading</span>
                      </>
                    )}
                  </div>
                  <p
                    className="font-crimson font-normal tracking-[0] text-stone-100"
                    style={typography}
                  >
                    {note.text}
                  </p>
                  {!note.hidden && (
                    <button
                      type="button"
                      onClick={() => handleShare(note.index)}
                      className="mt-6 font-stoke text-[0.58rem] lowercase tracking-[0.16em] text-stone-600 transition duration-300 hover:text-stone-200"
                    >
                      {copiedShare === note.index ? 'copied' : 'share'}
                    </button>
                  )}
                </div>
              </section>
            )
          })}
        </div>

        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#050505] via-[#050505]/85 to-transparent px-5 pb-5 pt-12 sm:px-6">
          <div className="pointer-events-auto mx-auto flex max-w-[760px] items-end justify-between font-stoke text-[0.58rem] lowercase tracking-[0.2em] text-stone-600">
            <span>scroll</span>
            <span className="tabular-nums">
              {activeFeedPosition || 1} / {visible.length}
            </span>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative h-[100dvh] overflow-y-auto bg-[#050505] text-stone-100">
      <audio ref={musicRef} src={OUTRO_SRC} preload="auto" loop />
      <audio ref={narrationRef} preload="none" />
      <PresenceWhisper />
      <div className="pointer-events-none fixed inset-0 grain opacity-[0.13]" />

      <div className="relative mx-auto w-full max-w-[760px] px-5 py-12 sm:px-6 md:py-20">
        <div className="flex items-start justify-between gap-4">
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
          <button
            type="button"
            onClick={() => setViewMode('feed')}
            className="font-stoke text-[0.58rem] lowercase tracking-[0.2em] text-stone-500 transition duration-300 hover:text-stone-200"
          >
            scroll
          </button>
        </div>

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

        <div className="mt-10 border-t border-white/10 pt-8">{sharedChrome}</div>

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
                    {noteNumber(note)}
                  </span>
                  <span className="font-stoke text-[0.6rem] lowercase tracking-[0.22em] text-stone-500">
                    {moodLabel[note.mood]}
                  </span>
                </div>
                <div className="flex flex-col gap-2 self-start">
                  <button
                    type="button"
                    onClick={() => listenToNote(note.index)}
                    className="font-stoke text-[0.58rem] lowercase tracking-[0.16em] text-stone-600 transition duration-300 hover:text-stone-200"
                  >
                    {narratingIndex === note.index ? 'reading' : 'listen'}
                  </button>
                  {!note.hidden && (
                    <button
                      type="button"
                      onClick={() => handleShare(note.index)}
                      className="font-stoke text-[0.58rem] lowercase tracking-[0.16em] text-stone-600 transition duration-300 hover:text-stone-200"
                    >
                      {copiedShare === note.index ? 'copied' : 'share'}
                    </button>
                  )}
                </div>
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
                onClick={() => {
                  setSent(false)
                  setSubmitError(false)
                }}
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
                  {submitError ? 'could not save — try again' : 'unsigned, unedited'}
                </span>
                <button
                  type="button"
                  onClick={submit}
                  disabled={draft.trim().length === 0 || submitting}
                  className="border border-white/15 bg-stone-100 px-6 py-3 font-stoke text-[0.72rem] lowercase tracking-[0.12em] text-[#050505] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? 'sending' : 'send'}
                </button>
              </div>
            </div>
          )}
        </section>

        <footer className="mt-16 flex flex-col gap-5 border-t border-white/10 pt-6 font-stoke text-[0.68rem] lowercase tracking-[0.14em] text-stone-500 md:flex-row md:items-center md:justify-between md:gap-4">
          <nav className="flex flex-col gap-2 md:flex-row md:items-center md:gap-2">
            <span className="text-stone-600">2026</span>
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
            <span className="hidden text-white/15 md:inline" aria-hidden="true">
              |
            </span>
            <a
              href="/letter"
              onClick={(event) => {
                event.preventDefault()
                navigate('/letter')
              }}
              className="transition hover:text-stone-100"
            >
              letter
            </a>
          </nav>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
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
          </div>
        </footer>
      </div>
    </main>
  )
}

export default Notes
