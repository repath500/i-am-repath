import { useEffect, useState } from 'react'
import {
  alsoTending,
  closingNote,
  mainWorks,
  pageIntro,
  type Work,
} from './ecosystem'
import MusicMute from './MusicMute'
import PresenceWhisper from './PresenceWhisper'
import { navigate } from './router'
import { updateWorkingOnMeta } from './share'
import { useMusicMuted } from './useMusicMuted'

function WorkLink({
  work,
  prominent,
}: {
  work: Work
  prominent?: boolean
}) {
  return (
    <a
      href={work.href}
      target="_blank"
      rel="noreferrer"
      className={`group mt-3 inline-flex max-w-full items-center gap-2.5 border-b border-white/15 pb-1 transition duration-300 hover:border-white/40 ${
        prominent ? 'md:gap-3' : ''
      }`}
    >
      <img
        src={work.icon}
        alt=""
        width={prominent ? 22 : 18}
        height={prominent ? 22 : 18}
        className="shrink-0 rounded-[3px] opacity-75 transition group-hover:opacity-100"
        loading="lazy"
        decoding="async"
      />
      <span
        className={`font-stoke lowercase tracking-[-0.01em] text-stone-200 transition group-hover:text-stone-50 ${
          prominent
            ? 'text-[clamp(1.35rem,4.5vw,2rem)] font-light'
            : 'text-[clamp(1.1rem,3.5vw,1.45rem)] font-light'
        }`}
      >
        {work.linkLabel}
      </span>
    </a>
  )
}

function WorkBlock({ work, prominent }: { work: Work; prominent?: boolean }) {
  return (
    <article
      className={`note-row border-t border-white/10 pt-10 md:pt-12 ${
        prominent ? 'first:border-t-0 first:pt-0' : ''
      }`}
    >
      <p className="font-stoke text-[0.62rem] lowercase tracking-[0.2em] text-stone-600">
        {work.role}
      </p>
      <h2 className="sr-only">{work.name}</h2>
      <WorkLink work={work} prominent={prominent} />
      <p className="mt-5 max-w-[52ch] font-crimson text-lg italic leading-[1.5] text-stone-500">
        {work.why}
      </p>
      <p className="mt-4 max-w-[58ch] font-crimson text-[1.05rem] leading-[1.58] text-stone-400">
        {work.building}
      </p>
      {work.more && (
        <p className="mt-4 max-w-[58ch] font-crimson text-[1.02rem] leading-[1.58] text-stone-500">
          {work.more}
        </p>
      )}
    </article>
  )
}

function WorkingOn() {
  const [now, setNow] = useState(() => new Date())
  const { musicMuted, toggleMusicMuted } = useMusicMuted()

  useEffect(() => {
    updateWorkingOnMeta()
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const clock = now
    .toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .toLowerCase()

  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden bg-[#050505] text-stone-100">
      <PresenceWhisper />
      <div className="pointer-events-none fixed inset-0 grain opacity-[0.13]" />

      <div className="relative mx-auto w-full max-w-[720px] px-5 py-12 sm:px-6 md:py-20">
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
          <span
            className="font-stoke text-[0.58rem] lowercase tabular-nums tracking-[0.18em] text-stone-600"
            aria-label="local time"
          >
            {clock}
          </span>
        </div>

        <header className="mt-12 md:mt-16">
          <h1 className="font-stoke text-[clamp(2.6rem,9vw,5rem)] font-light lowercase leading-none tracking-[-0.01em] text-stone-100">
            what i&apos;m working on
          </h1>
          <p className="mt-6 max-w-[48ch] font-crimson text-xl leading-[1.5] text-stone-400 md:text-[1.35rem]">
            {pageIntro.lede}
          </p>
          <div className="mt-6 space-y-5">
            {pageIntro.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="max-w-[54ch] font-crimson text-lg leading-[1.58] text-stone-500"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </header>

        <section className="mt-16 md:mt-20">
          <p className="font-stoke text-[0.62rem] lowercase tracking-[0.24em] text-stone-600">
            the work
          </p>
          <div className="mt-8">
            {mainWorks.map((work, index) => (
              <WorkBlock key={work.id} work={work} prominent={index === 0} />
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-white/10 pt-12 md:mt-20 md:pt-16">
          <p className="font-stoke text-[0.62rem] lowercase tracking-[0.24em] text-stone-600">
            also tending
          </p>
          <div className="mt-8">
            {alsoTending.map((work) => (
              <WorkBlock key={work.id} work={work} />
            ))}
          </div>
        </section>

        <p className="note-row mt-16 max-w-[52ch] font-crimson text-lg italic leading-[1.55] text-stone-600 md:mt-20">
          {closingNote}
        </p>

        <footer className="mt-16 flex flex-col gap-5 border-t border-white/10 pt-6 font-stoke text-[0.68rem] lowercase tracking-[0.14em] text-stone-500 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap items-center gap-2">
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
            <span className="text-white/15" aria-hidden="true">
              |
            </span>
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
            <span className="text-white/15" aria-hidden="true">
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
            <span className="text-white/15" aria-hidden="true">
              |
            </span>
            <a
              href="https://www.linkedin.com/in/repathkhan/"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-stone-100"
            >
              linkedin
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <MusicMute muted={musicMuted} onToggle={toggleMusicMuted} />
            <span>© {pageIntro.label}</span>
          </div>
        </footer>
      </div>
    </main>
  )
}

export default WorkingOn
