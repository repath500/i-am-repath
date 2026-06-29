import { useEffect, useRef, useState } from 'react'
import {
  fadeVolume,
  MUSIC_AMBIENT,
  OUTRO_SRC,
  duckMusicForSpeech,
  startAmbientMusic,
} from './audioConfig'
import { repathPublicLetterSpeakText } from './hiddenContent'
import RepathPublicLetter from './RepathPublicLetter'
import { getRepathPublicLetterVoiceSrc } from './voices'
import {
  addDaysFromToday,
  addLetter,
  datePresets,
  daysSinceLabel,
  daysSinceWritten,
  formatLetterDate,
  formatWrittenDate,
  getDueLetters,
  getLetterThread,
  getUpcomingLetters,
  isLetterDue,
  loadLetters,
  markLetterOpened,
  minDeliveryDate,
  type SavedLetter,
} from './letters'
import MusicMute from './MusicMute'
import {
  hasSeenLetterRule,
  markLetterRuleSeen,
} from './progress'
import { navigate } from './router'
import { useMusicMuted } from './useMusicMuted'

type LetterProps = {
  deliveryId?: string
}

type SealPhase = 'idle' | 'animating' | 'done'
type ReadingTarget = 'repath' | 'delivery' | null

const PLACEHOLDERS = [
  'dear future me —',
  "if you're reading this, you survived —",
  "don't forget —",
]

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
  const [deliverLabel, setDeliverLabel] = useState('')
  const [sealPhase, setSealPhase] = useState<SealPhase>('idle')
  const [sealDate, setSealDate] = useState('')
  const [, setRevision] = useState(0)
  const [activeDelivery, setActiveDelivery] = useState<SavedLetter | null>(null)
  const [replyToId, setReplyToId] = useState<string | null>(null)
  const [readingTarget, setReadingTarget] = useState<ReadingTarget>(null)
  const [soundBlocked, setSoundBlocked] = useState(false)
  const [showRule, setShowRule] = useState(!hasSeenLetterRule())
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const { musicMuted, toggleMusicMuted } = useMusicMuted()
  const musicRef = useRef<HTMLAudioElement>(null)
  const narrationRef = useRef<HTMLAudioElement>(null)
  const musicMutedRef = useRef(musicMuted)

  musicMutedRef.current = musicMuted

  const refreshLetters = () => setRevision((value) => value + 1)

  useEffect(() => {
    const timer = window.setInterval(
      () => setPlaceholderIndex((value) => (value + 1) % PLACEHOLDERS.length),
      4200,
    )
    return () => window.clearInterval(timer)
  }, [])

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

  const playNarration = async (
    target: ReadingTarget,
    options: { src?: string; text?: string },
    onComplete?: () => void,
  ) => {
    if (readingTarget === target) {
      narrationRef.current?.pause()
      window.speechSynthesis?.cancel()
      setReadingTarget(null)
      restoreMusic()
      return
    }

    narrationRef.current?.pause()
    window.speechSynthesis?.cancel()
    setReadingTarget(target)
    duckMusicForSpeech(musicRef.current, musicMutedRef.current)

    const finish = () => {
      setReadingTarget(null)
      restoreMusic()
      onComplete?.()
    }

    const narration = narrationRef.current
    if (!narration) {
      finish()
      return
    }

    if (options.src) {
      narration.pause()
      narration.currentTime = 0
      narration.src = options.src
      narration.volume = 1
      narration.onended = finish
      narration.onerror = () => {
        if (target === 'repath') {
          speakWithBrowser(repathPublicLetterSpeakText)
          window.setTimeout(
            finish,
            Math.min(120_000, repathPublicLetterSpeakText.length * 80),
          )
          return
        }
        finish()
      }
      narration.play().catch(() => {
        if (target === 'repath') {
          speakWithBrowser(repathPublicLetterSpeakText)
          window.setTimeout(
            finish,
            Math.min(120_000, repathPublicLetterSpeakText.length * 80),
          )
          return
        }
        finish()
      })
      return
    }

    const text = options.text?.trim()
    if (!text) {
      finish()
      return
    }

    try {
      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (response.ok) {
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
        return
      }
    } catch {
      // fall through to browser speech
    }

    speakWithBrowser(text)
    window.setTimeout(finish, Math.min(120_000, text.length * 80))
  }

  const listenToRepathLetter = () =>
    playNarration('repath', { src: getRepathPublicLetterVoiceSrc() })

  const dismissRule = () => {
    if (!showRule) return
    setShowRule(false)
    markLetterRuleSeen()
  }

  const beginSeal = () => {
    const text = draft.trim()
    if (!text || !deliverAt || sealPhase !== 'idle') return

    dismissRule()
    setSealDate(deliverAt)
    setSealPhase('animating')

    window.setTimeout(() => {
      addLetter(text, deliverAt, {
        replyTo: replyToId ?? undefined,
        label: deliverLabel.trim() || undefined,
      })
      refreshLetters()
      setDraft('')
      setDeliverLabel('')
      setReplyToId(null)
      setDeliverAt(minDeliveryDate())
      setSealPhase('done')
    }, 3000)
  }

  const startWriteBack = (letter: SavedLetter) => {
    setReplyToId(letter.id)
    setActiveDelivery(null)
    setDeliverAt(minDeliveryDate())
    setDeliverLabel('')
    setSealPhase('idle')
  }

  const upcoming = getUpcomingLetters()
  const due = getDueLetters().filter((letter) => letter.openedAt)
  const replyContext = replyToId
    ? loadLetters().find((letter) => letter.id === replyToId)
    : null

  if (activeDelivery) {
    const elapsed = daysSinceLabel(
      daysSinceWritten(activeDelivery.createdAt),
    )
    const thread = getLetterThread(activeDelivery.id)

    return (
      <main className="relative flex min-h-[100dvh] items-center bg-[#050505] px-5 py-16 text-stone-100 sm:px-6">
        <audio ref={musicRef} src={OUTRO_SRC} preload="auto" loop />
        <audio ref={narrationRef} preload="none" />
        <div className="pointer-events-none fixed inset-0 grain opacity-[0.13]" />

        <div className="relative mx-auto w-full max-w-[680px]">
          <p className="font-stoke text-[0.62rem] lowercase tracking-[0.22em] text-stone-600">
            from past you · written {formatWrittenDate(activeDelivery.createdAt)}
          </p>
          <p className="mt-3 font-stoke text-[0.58rem] lowercase tracking-[0.18em] text-stone-500">
            you wrote this {elapsed}
          </p>
          {activeDelivery.label && (
            <p className="mt-2 font-crimson text-[1rem] italic text-stone-500">
              {activeDelivery.label}
            </p>
          )}
          <p className="mt-8 font-crimson text-[clamp(1.35rem,4.5vw,2rem)] leading-[1.42] text-stone-100">
            {activeDelivery.text}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() =>
                playNarration('delivery', { text: activeDelivery.text })
              }
              className="font-stoke text-[0.58rem] lowercase tracking-[0.16em] text-stone-500 transition duration-300 hover:text-stone-200"
            >
              {readingTarget === 'delivery' ? 'reading' : 'listen'}
            </button>
            <button
              type="button"
              onClick={() => startWriteBack(activeDelivery)}
              className="font-stoke text-[0.58rem] lowercase tracking-[0.16em] text-stone-500 transition duration-300 hover:text-stone-200"
            >
              write back
            </button>
            <button
              type="button"
              onClick={() => setActiveDelivery(null)}
              className="font-stoke text-[0.58rem] lowercase tracking-[0.16em] text-stone-600 transition duration-300 hover:text-stone-300"
            >
              close
            </button>
          </div>
          {thread.length > 1 && (
            <div className="mt-12 border-t border-white/10 pt-8">
              <p className="font-stoke text-[0.58rem] lowercase tracking-[0.2em] text-stone-600">
                thread
              </p>
              <ul className="mt-4 space-y-2">
                {thread.map((letter) => (
                  <li
                    key={letter.id}
                    className="font-stoke text-[0.58rem] lowercase tracking-[0.14em] text-stone-500"
                  >
                    {formatWrittenDate(letter.createdAt)}
                    {letter.id === activeDelivery.id ? ' · now' : ''}
                    {!isLetterDue(letter) ? ' · sealed' : ' · opened'}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-[100dvh] overflow-y-auto bg-[#050505] text-stone-100">
      <audio ref={musicRef} src={OUTRO_SRC} preload="auto" loop />
      <audio ref={narrationRef} preload="none" />
      <div className="pointer-events-none fixed inset-0 grain opacity-[0.13]" />

      {sealPhase === 'animating' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/92 px-6 transition-opacity duration-1000"
          aria-live="polite"
        >
          <p className="max-w-[28ch] text-center font-crimson text-[clamp(1.25rem,4vw,1.75rem)] italic leading-[1.45] text-stone-300">
            this stays with you until {formatLetterDate(sealDate)}.
          </p>
        </div>
      )}

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

      <RepathPublicLetter
        reading={readingTarget === 'repath'}
        onListen={listenToRepathLetter}
      />

      <div className="relative mx-auto w-full max-w-[760px] px-5 pb-12 sm:px-6 md:pb-20">
        <header className="mt-4 md:mt-6">
          <p className="font-stoke text-[0.62rem] lowercase tracking-[0.22em] text-stone-600">
            yours
          </p>
          <h1 className="mt-3 font-stoke text-[clamp(2.2rem,8vw,4.5rem)] font-light lowercase leading-none tracking-[-0.01em] text-stone-100">
            write &amp; seal
          </h1>
          <p className="mt-5 max-w-[46ch] font-crimson text-lg italic leading-[1.5] text-stone-500 md:text-xl">
            a letter for the version of you that hasn&apos;t arrived yet. it
            stays on your device until the day you chose. never leaves this
            browser.
          </p>
        </header>

        {sealPhase === 'done' ? (
          <div className="mt-12 border-t border-white/10 pt-10">
            <p className="font-crimson text-[1.5rem] italic leading-[1.4] text-stone-300 md:text-[1.7rem]">
              sealed. it&apos;ll find you when the date comes.
            </p>
            <button
              type="button"
              onClick={() => setSealPhase('idle')}
              className="mt-5 font-stoke text-[0.7rem] lowercase tracking-[0.14em] text-stone-500 transition duration-300 hover:text-stone-100"
            >
              write another
            </button>
          </div>
        ) : (
          <section className="mt-12 border-t border-white/10 pt-10">
            {replyContext && (
              <p className="mb-6 font-stoke text-[0.58rem] lowercase tracking-[0.18em] text-stone-500">
                writing back to {formatWrittenDate(replyContext.createdAt)}
                <button
                  type="button"
                  onClick={() => setReplyToId(null)}
                  className="ml-3 text-stone-600 transition hover:text-stone-300"
                >
                  cancel
                </button>
              </p>
            )}

            {showRule && (
              <p className="mb-5 font-crimson text-[1.05rem] italic text-stone-500">
                one truth. no performance.
              </p>
            )}

            <textarea
              value={draft}
              onChange={(event) => {
                dismissRule()
                setDraft(event.target.value)
              }}
              onFocus={dismissRule}
              rows={4}
              placeholder={PLACEHOLDERS[placeholderIndex]}
              className="w-full resize-none border-b border-white/12 bg-transparent pb-3 font-crimson text-[1.35rem] leading-[1.45] text-stone-200 outline-none transition-colors duration-300 placeholder:text-stone-600 focus:border-white/30 md:text-[1.5rem]"
            />

            <div className="mt-8 flex flex-wrap gap-2">
              {datePresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setDeliverAt(addDaysFromToday(preset.days))}
                  className={`border px-3 py-1.5 font-stoke text-[0.58rem] lowercase tracking-[0.14em] transition duration-300 ${
                    deliverAt === addDaysFromToday(preset.days)
                      ? 'border-white/30 text-stone-200'
                      : 'border-white/10 text-stone-600 hover:border-white/20 hover:text-stone-400'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-5">
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
                <label className="flex flex-col gap-2 font-stoke text-[0.62rem] lowercase tracking-[0.18em] text-stone-600">
                  label (optional)
                  <input
                    type="text"
                    value={deliverLabel}
                    onChange={(event) => setDeliverLabel(event.target.value)}
                    placeholder="when i move / when i need it"
                    className="border-b border-white/12 bg-transparent pb-2 font-crimson text-[1.05rem] text-stone-300 outline-none placeholder:text-stone-600 focus:border-white/30"
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={beginSeal}
                disabled={draft.trim().length === 0 || sealPhase !== 'idle'}
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
                  your sealed letters
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
                      {letter.label && (
                        <p className="mt-1 font-crimson text-[0.95rem] italic text-stone-600">
                          {letter.label}
                        </p>
                      )}
                      <p className="mt-2 font-crimson text-[1.05rem] italic leading-[1.4] text-stone-600">
                        sealed until then
                      </p>
                      <p className="mt-1 font-stoke text-[0.52rem] lowercase tracking-[0.14em] text-stone-700">
                        written {formatWrittenDate(letter.createdAt)}
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
            <span className="hidden text-white/15 md:inline" aria-hidden="true">
              |
            </span>
            <a
              href="/working-on"
              onClick={(event) => {
                event.preventDefault()
                navigate('/working-on')
              }}
              className="transition hover:text-stone-100"
            >
              working on
            </a>
          </nav>
          <MusicMute muted={musicMuted} onToggle={toggleMusicMuted} />
        </footer>
      </div>
    </main>
  )
}

export default Letter
