import MusicMute from './MusicMute'
import { navigate } from './router'

type SiteFooterProps = {
  layout?: 'home' | 'page'
  clock?: string
  musicMuted: boolean
  onToggleMusic: () => void
}

const navLink =
  'transition duration-300 hover:text-stone-100'

function NavLinks({ className = '' }: { className?: string }) {
  return (
    <nav className={`flex flex-wrap items-center gap-2 ${className}`}>
      <a
        href="/"
        onClick={(event) => {
          event.preventDefault()
          navigate('/')
        }}
        className={navLink}
      >
        home
      </a>
      <span className="text-white/15" aria-hidden="true">
        ·
      </span>
      <a
        href="/notes"
        onClick={(event) => {
          event.preventDefault()
          navigate('/notes')
        }}
        className={navLink}
      >
        notes
      </a>
      <span className="text-white/15" aria-hidden="true">
        ·
      </span>
      <a
        href="/letter"
        onClick={(event) => {
          event.preventDefault()
          navigate('/letter')
        }}
        className={navLink}
      >
        letter
      </a>
      <span className="text-white/15" aria-hidden="true">
        ·
      </span>
      <a
        href="/working-on"
        onClick={(event) => {
          event.preventDefault()
          navigate('/working-on')
        }}
        className={navLink}
      >
        building
      </a>
    </nav>
  )
}

function SiteFooter({
  layout = 'page',
  clock,
  musicMuted,
  onToggleMusic,
}: SiteFooterProps) {
  if (layout === 'home') {
    return (
      <footer className="mx-auto grid w-full max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-4 border-t border-white/10 pt-4 font-stoke text-[0.62rem] lowercase tracking-[0.12em] text-stone-500 sm:text-[0.68rem] sm:tracking-[0.14em]">
        <div className="flex flex-wrap items-center gap-2 justify-self-start">
          <a
            href="/"
            onClick={(event) => {
              event.preventDefault()
              navigate('/')
            }}
            className="tracking-[0.18em] text-stone-400 transition duration-300 hover:text-stone-100"
          >
            repath
          </a>
          <span className="text-white/15" aria-hidden="true">
            ·
          </span>
          <NavLinks />
        </div>
        {clock ? (
          <span
            className="justify-self-center tabular-nums tracking-[0.18em] text-stone-400"
            aria-label="local time"
          >
            {clock}
          </span>
        ) : (
          <span aria-hidden="true" />
        )}
        <div className="flex items-center justify-end gap-4 justify-self-end">
          <MusicMute muted={musicMuted} onToggle={onToggleMusic} />
          <span className="text-stone-600">© repath khan</span>
        </div>
      </footer>
    )
  }

  return (
    <footer className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 font-stoke text-[0.68rem] lowercase tracking-[0.14em] text-stone-500 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <a
          href="/"
          onClick={(event) => {
            event.preventDefault()
            navigate('/')
          }}
          className="tracking-[0.18em] text-stone-400 transition duration-300 hover:text-stone-100"
        >
          repath
        </a>
        <span className="text-white/15" aria-hidden="true">
          ·
        </span>
        <NavLinks />
      </div>
      <div className="flex items-center gap-4">
        {clock ? (
          <span
            className="tabular-nums tracking-[0.16em] text-stone-600"
            aria-label="local time"
          >
            {clock}
          </span>
        ) : null}
        <MusicMute muted={musicMuted} onToggle={onToggleMusic} />
        <span className="text-stone-600">© repath khan</span>
      </div>
    </footer>
  )
}

export default SiteFooter
