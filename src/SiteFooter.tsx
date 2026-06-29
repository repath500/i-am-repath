import { identity } from './ecosystem'
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
      <footer className="mx-auto w-full max-w-[1400px] border-t border-white/10 pt-5 font-stoke text-[0.64rem] lowercase tracking-[0.14em] text-stone-500 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4 sm:pt-4 sm:text-[0.68rem]">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 sm:justify-self-start">
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
            className="mt-4 block tabular-nums tracking-[0.18em] text-stone-400 sm:mt-0 sm:justify-self-center"
            aria-label="local time"
          >
            {clock}
          </span>
        ) : (
          <span aria-hidden="true" className="hidden sm:block" />
        )}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 sm:mt-0 sm:justify-end sm:justify-self-end">
          <MusicMute muted={musicMuted} onToggle={onToggleMusic} />
          <span className="text-stone-600">
            © repath khan
            <span className="text-white/15 px-1.5" aria-hidden="true">
              ·
            </span>
            {identity.location}
          </span>
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
        <span className="text-stone-600">
          © repath khan
          <span className="hidden text-white/15 px-1.5 md:inline" aria-hidden="true">
            ·
          </span>
          <span className="hidden md:inline">{identity.location}</span>
        </span>
      </div>
    </footer>
  )
}

export default SiteFooter
