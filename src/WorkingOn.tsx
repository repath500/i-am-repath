import { useEffect, useState } from 'react'
import {
  beliefs,
  closingNote,
  mainWorks,
  moreFromLab,
  openToWork,
  pageIntro,
  type Work,
} from './ecosystem'
import LetterTeaser from './LetterTeaser'
import ProofOfWork from './ProofOfWork'
import SiteFooter from './SiteFooter'
import PresenceWhisper from './PresenceWhisper'
import { navigate } from './router'
import { updateWorkingOnMeta } from './share'
import { useMusicMuted } from './useMusicMuted'

const bodyText =
  'font-crimson text-[1.13rem] leading-[1.65] text-stone-300 md:text-[1.2rem] md:leading-[1.68]'

function WorkLink({ work }: { work: Work }) {
  return (
    <a
      href={work.href}
      target="_blank"
      rel="noreferrer"
      className="group mt-8 inline-flex max-w-full items-center gap-2.5 border-b border-white/25 pb-1 transition duration-300 hover:border-white/55"
    >
      <img
        src={work.icon}
        alt=""
        width={18}
        height={18}
        className="shrink-0 rounded-[3px] opacity-90 transition group-hover:opacity-100"
        loading="lazy"
        decoding="async"
      />
      <span className="font-stoke text-[clamp(1.05rem,3.2vw,1.25rem)] font-light lowercase tracking-[-0.01em] text-stone-200 transition group-hover:text-white">
        {work.linkLabel}
      </span>
    </a>
  )
}

function WorkBlock({ work, prominent }: { work: Work; prominent?: boolean }) {
  return (
    <article
      className={`note-row border-t border-white/10 pt-12 md:pt-14 ${
        prominent ? 'first:border-t-0 first:pt-0' : ''
      }`}
    >
      <h2
        className={`font-stoke lowercase leading-none tracking-[-0.01em] text-stone-100 ${
          prominent
            ? 'text-[clamp(1.8rem,5.5vw,2.6rem)] font-light'
            : 'text-[clamp(1.5rem,4.5vw,2rem)] font-light'
        }`}
      >
        {work.name}
      </h2>
      <p className="mt-3 font-stoke text-[0.68rem] lowercase tracking-[0.14em] text-stone-500">
        {work.role}
      </p>
      <div className="mt-6 space-y-4">
        {work.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className={`max-w-[58ch] ${bodyText}`}>
            {paragraph}
          </p>
        ))}
      </div>
      <WorkLink work={work} />
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

      <div className="relative mx-auto w-full max-w-[740px] px-5 py-12 sm:px-6 md:py-20">
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
          <p className="mt-5 font-stoke text-[0.68rem] lowercase tracking-[0.16em] text-stone-500">
            {pageIntro.alsoKnownAs}
          </p>
          <p className="mt-8 max-w-[50ch] font-crimson text-[1.22rem] leading-[1.65] text-stone-200 md:text-[1.42rem] md:leading-[1.68]">
            {pageIntro.lede}
          </p>
          <div className="mt-8 space-y-6">
            {pageIntro.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className={`max-w-[58ch] ${bodyText}`}>
                {paragraph}
              </p>
            ))}
          </div>
        </header>

        <section className="mt-16 border-t border-white/10 pt-12 md:mt-20 md:pt-16">
          <p className="font-stoke text-[0.65rem] lowercase tracking-[0.24em] text-stone-500">
            what i believe
          </p>
          <ul className="mt-6 space-y-4">
            {beliefs.map((belief) => (
              <li
                key={belief}
                className={`flex gap-3 max-w-[58ch] ${bodyText}`}
              >
                <span className="text-stone-600" aria-hidden="true">
                  ·
                </span>
                <span>{belief}</span>
              </li>
            ))}
          </ul>
        </section>

        <LetterTeaser />

        <ProofOfWork />

        <section className="mt-16 border-t border-white/10 pt-12 md:mt-20 md:pt-16">
          <p className="font-stoke text-[0.65rem] lowercase tracking-[0.24em] text-stone-500">
            the work
          </p>
          <div className="mt-10">
            {mainWorks.map((work, index) => (
              <WorkBlock key={work.id} work={work} prominent={index === 0} />
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-white/10 pt-12 md:mt-20 md:pt-16">
          <p className="font-stoke text-[0.65rem] lowercase tracking-[0.24em] text-stone-500">
            more from the lab
          </p>
          <div className="mt-10">
            {moreFromLab.map((work) => (
              <WorkBlock key={work.id} work={work} />
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-white/10 pt-12 md:mt-20 md:pt-16">
          <p className="font-stoke text-[0.65rem] lowercase tracking-[0.24em] text-stone-500">
            {openToWork.heading}
          </p>
          <div className="mt-6 space-y-4">
            {openToWork.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className={`max-w-[58ch] ${bodyText}`}>
                {paragraph}
              </p>
            ))}
          </div>
          <a
            href={`mailto:${openToWork.email}`}
            className="mt-6 inline-block border-b border-white/25 pb-1 font-stoke text-[clamp(1.1rem,3.5vw,1.35rem)] lowercase text-stone-100 transition hover:border-white/55 hover:text-white"
          >
            {openToWork.email}
          </a>
        </section>

        <p className={`note-row mt-16 max-w-[58ch] md:mt-20 ${bodyText} text-stone-400`}>
          {closingNote}
        </p>

        <SiteFooter
          musicMuted={musicMuted}
          onToggleMusic={toggleMusicMuted}
          clock={clock}
        />
      </div>
    </main>
  )
}

export default WorkingOn
