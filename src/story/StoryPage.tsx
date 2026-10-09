import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { beliefs, openToWork, shipLog } from '../ecosystem'
import { repathPublicLetters } from '../hiddenContent'
import ProofOfWork from '../ProofOfWork'
import SiteFooter from '../SiteFooter'
import { notes } from '../notes'
import { navigate } from '../router'
import { useMusicMuted } from '../useMusicMuted'
import { OUTRO_SRC, MUSIC_AMBIENT } from '../audioConfig'
import FilmReel from './FilmReel'
import Terminal from './Terminal'
import './story.css'

const Crystal = lazy(() => import('./Crystal'))

const products = [
  {
    id: 'leemerchat',
    scene: 'sc05-leemer-backup',
    who: 'leemer',
    name: 'leemerchat',
    href: 'https://www.leemerchat.com',
    line: 'started when gpt-4 went down. became the main thing.',
    beat: 'the big model went dark. leemer swung in with a lantern for every backup.',
  },
  {
    id: 'critique',
    scene: 'sc06-crit-court',
    who: 'crit',
    name: 'critique',
    href: 'https://critique.sh',
    line: 'your agent writes the change. critique checks it.',
    beat: 'crit sits the bench. the agent sweats. the stamp says repair ready.',
  },
  {
    id: 'daildex',
    scene: 'sc07-dex-flies',
    who: 'dex',
    name: 'dáildex',
    href: 'https://daildex.com',
    line: 'see what your td said, did and voted for, in your inbox.',
    beat: 'dex flies the record to you. plain english. a source on every letter. featured on data.gov.ie.',
  },
  {
    id: 'warren',
    scene: 'sc08-warren-hole',
    who: 'warren',
    name: 'warren.wiki',
    href: 'https://warren.wiki',
    line: 'for people who think in networks, not linear articles.',
    beat: 'warren falls down the hole on purpose, reading the whole way.',
  },
  {
    id: 'labs',
    scene: 'sc09-born-grows',
    who: 'born',
    name: 'leemerlabs',
    href: 'https://www.leemerlabs.com',
    line: 'ai made for irish reality.',
    beat: 'born is a seedling of crystal. the lab grows it in public.',
  },
] as const

const tickets = [
  '#1840 · 1× spice bag · 1× curry chips · collection 18:40',
  '#2026 · 2,500 commits · extra spicy · no rush',
  '#0001 · 1× big dream · hold the doubt',
  '#0300 · the night shift · still open',
]

function WorldSplit() {
  const [night, setNight] = useState(48)

  return (
    <div className="worlds">
      <label className="worlds-label" htmlFor="world-split">
        drag the night
        <input
          id="world-split"
          type="range"
          min={18}
          max={82}
          value={night}
          onChange={(event) => setNight(Number(event.target.value))}
        />
      </label>
      <div className="worlds-panes" style={{ gridTemplateColumns: `${night}fr ${100 - night}fr` }}>
        <article>
          <h3>the counter</h3>
          <p>sodium light, tickets, heat. pressure you can feel the same day.</p>
        </article>
        <article>
          <h3>the terminal</h3>
          <pre>{`$ critique finish --intent "stop duplicate charges"
→ outcome   repair_ready
→ evidence  attached
exit 2`}</pre>
        </article>
      </div>
    </div>
  )
}

const sceneVideos: Record<string, { video: string; once?: boolean }> = {
  'sc01-storybook': { video: 'v01-storybook-idle' },
  'sc02-counter': { video: 'v02-counter-chaos' },
  'sc04-night-shift': { video: 'v04-night-shift' },
  'sc05-leemer-backup': { video: 'v05-leemer-arrives', once: true },
  'sc06-crit-court': { video: 'v06-crit-gavel', once: true },
  'sc07-dex-flies': { video: 'v07-dex-flight' },
  'sc08-warren-hole': { video: 'v08-warren-fall' },
  'sc09-born-grows': { video: 'v09-born-grows' },
  'sc10-fog': { video: 'v10-fog' },
  'sc11-fireflies': { video: 'v11-fireflies' },
  'sc12-sunrise': { video: 'v12-sunrise' },
  'sc13-bottle': { video: 'v13-bottles' },
  'sc15-not-even-close': { video: 'v14-not-even-close', once: true },
}

function prefersStill() {
  if (typeof window === 'undefined') return true
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return Boolean(connection?.saveData)
}

function SceneVideo({ video, once }: { video: string; once?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  const [skip] = useState(prefersStill)

  useEffect(() => {
    const el = ref.current
    if (!el || skip) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (once) el.currentTime = 0
          void el.play().catch(() => undefined)
        } else {
          el.pause()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [once, skip])

  if (skip) return null
  return (
    <video
      ref={ref}
      className={`scene-video${ready ? ' is-ready' : ''}`}
      muted
      playsInline
      loop={!once}
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
      onLoadedData={() => setReady(true)}
      onError={() => setReady(false)}
    >
      <source src={`/story/video/${video}.webm`} type="video/webm" />
      <source src={`/story/video/${video}.mp4`} type="video/mp4" />
    </video>
  )
}

function Scene({ id, alt }: { id: string; alt: string }) {
  const [src, setSrc] = useState(`/story/img/${id}.webp`)
  const [failed, setFailed] = useState(false)
  const motion = sceneVideos[id]
  if (failed) return <div className="scene-fallback" role="img" aria-label={alt} />
  return (
    <>
      <img
        src={src}
        alt={alt}
        onError={() => {
          if (src.endsWith('.webp')) setSrc(`/story/raw/img/${id}.png`)
          else setFailed(true)
        }}
      />
      {motion && <SceneVideo video={motion.video} once={motion.once} />}
    </>
  )
}

function StoryPage() {
  const { musicMuted, toggleMusicMuted } = useMusicMuted()
  const [clock, setClock] = useState('')
  const [terminal, setTerminal] = useState(false)
  const [buffer, setBuffer] = useState('')
  const latest = repathPublicLetters[repathPublicLetters.length - 1]

  useEffect(() => {
    const tick = () => {
      setClock(
        new Date().toLocaleTimeString('en-IE', {
          timeZone: 'Europe/Dublin',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      )
    }
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const audio = document.getElementById('story-bed') as HTMLAudioElement | null
    if (!audio) return
    audio.volume = musicMuted ? 0 : MUSIC_AMBIENT
    if (musicMuted) audio.pause()
  }, [musicMuted])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key === 'Escape') {
        setTerminal(false)
        return
      }
      if (event.key.length !== 1) return
      const next = (buffer + event.key.toLowerCase()).slice(-8)
      setBuffer(next)
      if (next.endsWith('critique')) setTerminal(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [buffer])

  const startMusic = () => {
    const audio = document.getElementById('story-bed') as HTMLAudioElement | null
    if (!audio || musicMuted) return
    audio.volume = MUSIC_AMBIENT
    audio.play().catch(() => {})
  }

  return (
    <main className="story" onPointerDown={startMusic}>
      <audio id="story-bed" src={OUTRO_SRC} loop preload="none" />
      <div className="story-grain" aria-hidden="true" />
      <a className="story-skip" href="#counter">skip the story</a>

      <header className="story-nav">
        <a href="/" onClick={(event) => { event.preventDefault(); navigate('/') }}>repath</a>
        <nav>
          <a href="#counter">counter</a>
          <a href="#reel">films</a>
          <a href="#shift">work</a>
          <a href="/notes" onClick={(event) => { event.preventDefault(); navigate('/notes') }}>notes</a>
          <a href="/letter" onClick={(event) => { event.preventDefault(); navigate('/letter') }}>letter</a>
        </nav>
        <span className="story-clock">waterford · {clock}</span>
      </header>

      <section className="chapter hero">
        <Scene id="sc01-storybook" alt="An open storybook. Waterford at dusk beside the words: once upon a time, in waterford." />
        <div className="hero-copy">
          <p className="eyebrow">a waterford picture</p>
          <h1>i am repath</h1>
          <p className="lede">
            once upon a time, in waterford, the oldest city in ireland, there lived a boy who
            worked the counter by day and built the future by night.
          </p>
        </div>
        <div className="hero-crystal" aria-hidden="true">
          <Suspense fallback={null}>
            <Crystal />
          </Suspense>
        </div>
      </section>

      <section className="chapter band" id="counter">
        <div className="chapter-head">
          <p className="eyebrow">chapter 01</p>
          <h2>the counter</h2>
        </div>
        <figure className="frame">
          <Scene id="sc02-counter" alt="Ray juggling takeaway orders while a spice bag dances on the counter." />
        </figure>
        <div className="split">
          <p className="voice">
            in a takeaway, nobody cares about your clever theory. customers wait. staff stress.
            money moves. that shaped how i think about software.
          </p>
          <ul className="tickets">
            {tickets.map((ticket) => (
              <li key={ticket}>{ticket}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="chapter band night" id="reel">
        <div className="chapter-head">
          <p className="eyebrow">chapter 01b</p>
          <h2>the reel</h2>
          <p className="aside">some moments i kept, and the small truths they left behind.</p>
        </div>
        <FilmReel />
      </section>

      <section className="chapter band" id="worlds">
        <div className="chapter-head">
          <p className="eyebrow">chapter 02</p>
          <h2>two worlds</h2>
        </div>
        <figure className="frame">
          <Scene id="sc03-two-worlds" alt="Ray split between the takeaway and the attic lab." />
        </figure>
        <WorldSplit />
        <p className="voice">two worlds. same person. one taught me pressure. the other taught me leverage.</p>
      </section>

      <section className="chapter band night" id="shift">
        <div className="chapter-head">
          <p className="eyebrow">chapter 03 · the night shift</p>
          <h2>one light. five colours.</h2>
          <p className="aside">everything i&apos;m building, woken up by the crystal.</p>
        </div>
        <figure className="frame wide">
          <Scene id="sc04-night-shift" alt="The attic at 3am. Ray, the crystal, and the sidekicks." />
        </figure>
        <div className="products">
          {products.map((product) => (
            <article key={product.id} className="product">
              <figure>
                <Scene id={product.scene} alt="" />
              </figure>
              <p className="eyebrow">{product.who}</p>
              <h3>{product.name}</h3>
              <p>{product.beat}</p>
              <p className="product-line">{product.line}</p>
              <a href={product.href} target="_blank" rel="noreferrer">visit {product.name}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="chapter band fog" id="middle">
        <div className="chapter-head">
          <p className="eyebrow">chapter 04</p>
          <h2>the middle</h2>
        </div>
        <figure className="frame">
          <Scene id="sc10-fog" alt="Ray walking a foggy quay, following small lights that read resolve, still here, keep going." />
        </figure>
        <div className="middle-lines">
          <p>i don&apos;t really know what i&apos;m chasing right now.</p>
          <p>not broken. not finished. just tired in a way that is hard to explain.</p>
          <p>but even with all of that, there is still something in me that hasn&apos;t fully given up.</p>
        </div>
      </section>

      <section className="chapter band night" id="notes">
        <div className="chapter-head">
          <p className="eyebrow">chapter 05</p>
          <h2>the fireflies</h2>
          <p className="aside">the notes are the small lights. they got me through the fog.</p>
        </div>
        <ul className="fireflies">
          {notes.slice(4, 7).map((note) => (
            <li key={note.text.slice(0, 24)}>{note.text}</li>
          ))}
        </ul>
        <a className="text-link" href="/notes" onClick={(event) => { event.preventDefault(); navigate('/notes') }}>
          read the notes
        </a>
      </section>

      <section className="chapter band" id="receipts">
        <div className="chapter-head">
          <p className="eyebrow">chapter 06</p>
          <h2>receipts</h2>
        </div>
        <figure className="frame">
          <Scene id="sc12-sunrise" alt="Sunrise over a glass city, the cast cheering on a hill." />
        </figure>
        <ul className="beliefs">
          {beliefs.map((belief) => (
            <li key={belief}>{belief}</li>
          ))}
          <li>ireland can compete globally. you do not need the usual network.</li>
        </ul>
        <ol className="shiplog">
          {shipLog.map((entry) => (
            <li key={entry.line}>
              <span>{entry.date}</span>
              {entry.line}
            </li>
          ))}
        </ol>
        <ProofOfWork />
      </section>

      <section className="chapter band night" id="letter">
        <div className="chapter-head">
          <p className="eyebrow">chapter 07</p>
          <h2>write one</h2>
        </div>
        <figure className="frame">
          <Scene id="sc13-bottle" alt="Hands setting a glowing letter bottle onto a river of other bottles." />
        </figure>
        <blockquote>
          <p>{latest.paragraphs[0]}</p>
          <a href="/letter" onClick={(event) => { event.preventDefault(); navigate('/letter') }}>
            read the letters, or seal your own
          </a>
        </blockquote>
      </section>

      <section className="chapter finale" id="end">
        <figure className="frame endcard">
          <Scene id="sc15-not-even-close" alt="The end is crossed out. Under it: not even close." />
        </figure>
        <h2>not even close.</h2>
        <p className="voice">{openToWork.paragraphs[0]}</p>
        <div className="envelopes">
          {openToWork.emails.map((item) => (
            <a key={item.address} href={`mailto:${item.address}`}>
              <span>{item.label}</span>
              {item.address}
            </a>
          ))}
        </div>
        <div className="credits">
          <p>the night shift · a waterford picture</p>
          <p>written and directed by repath khan</p>
          <p>also known as ray</p>
          <p>code review, crit · post, dex · lighting, leemer</p>
          <p>research, warren · growing, born · catering, the takeaway</p>
          <p>chaos, spice bag</p>
          <p>filmed on location in waterford, ireland</p>
        </div>
      </section>

      <div className="story-footer">
        <SiteFooter
          clock={clock}
          musicMuted={musicMuted}
          onToggleMusic={toggleMusicMuted}
        />
      </div>
      <Terminal open={terminal} onClose={() => setTerminal(false)} />
    </main>
  )
}

export default StoryPage
