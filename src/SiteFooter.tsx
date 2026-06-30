import { useEffect, useRef, useState } from 'react'
import { identity } from './ecosystem'
import { repathPublicLetters } from './hiddenContent'
import LetterBadge from './LetterBadge'
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

const navItems = [
  { href: '/', label: 'home' },
  { href: '/notes', label: 'notes' },
  { href: '/letter', label: 'letter' },
  { href: '/working-on', label: 'building' },
] as const

function BrandLink({ className = '' }: { className?: string }) {
  return (
    <a
      href="/"
      onClick={(event) => {
        event.preventDefault()
        navigate('/')
      }}
      className={`tracking-[0.18em] text-stone-400 transition duration-300 hover:text-stone-100 ${className}`}
    >
      repath
    </a>
  )
}

function NavLinkItem({
  href,
  label,
  badge,
}: {
  href: string
  label: string
  badge?: string
}) {
  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault()
        navigate(href)
      }}
      className={`inline-flex items-center gap-1.5 ${navLink}`}
    >
      {label}
      {badge ? <LetterBadge>{badge}</LetterBadge> : null}
    </a>
  )
}

function NavLinks({
  className = '',
  vertical = false,
  showLetterBadge = false,
}: {
  className?: string
  vertical?: boolean
  showLetterBadge?: boolean
}) {
  const letterBadge =
    showLetterBadge && repathPublicLetters.length > 1
      ? `letter ${repathPublicLetters.length}`
      : undefined

  if (vertical) {
    return (
      <nav className={`flex flex-col gap-3 ${className}`}>
        {navItems.map((item) => (
          <NavLinkItem
            key={item.href}
            href={item.href}
            label={item.label}
            badge={item.href === '/letter' ? letterBadge : undefined}
          />
        ))}
      </nav>
    )
  }

  return (
    <nav className={`flex flex-wrap items-center gap-2 ${className}`}>
      {navItems.map((item, index) => (
        <span key={item.href} className="inline-flex items-center gap-2">
          {index > 0 ? (
            <span className="text-white/15" aria-hidden="true">
              ·
            </span>
          ) : null}
          <NavLinkItem
            href={item.href}
            label={item.label}
            badge={item.href === '/letter' ? letterBadge : undefined}
          />
        </span>
      ))}
    </nav>
  )
}

function Copyright({ showLocation = true }: { showLocation?: boolean }) {
  return (
    <span className="text-stone-600">
      © repath khan
      {showLocation ? (
        <>
          <span className="px-1.5 text-white/15" aria-hidden="true">
            ·
          </span>
          {identity.location}
        </>
      ) : null}
    </span>
  )
}

function FooterMoreMenu({
  clock,
  musicMuted,
  onToggleMusic,
  hideFrom = 'md',
  showLetterBadge = false,
}: {
  clock?: string
  musicMuted: boolean
  onToggleMusic: () => void
  hideFrom?: 'sm' | 'md'
  showLetterBadge?: boolean
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const hideClass = hideFrom === 'sm' ? 'sm:hidden' : 'md:hidden'

  return (
    <div ref={rootRef} className={`relative ${hideClass}`}>
      <div
        id="footer-more-menu"
        className={`absolute inset-x-0 bottom-full mb-2 origin-bottom rounded border border-white/10 bg-[#0a0a0a]/96 px-4 py-4 shadow-[0_-12px_40px_rgba(0,0,0,0.45)] backdrop-blur-sm transition duration-300 ${
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-2 opacity-0'
        }`}
        aria-hidden={!open}
      >
        <NavLinks vertical showLetterBadge={showLetterBadge} />
        <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
          {clock ? (
            <span
              className="block tabular-nums tracking-[0.16em] text-stone-500"
              aria-label="local time"
            >
              {clock}
            </span>
          ) : null}
          <MusicMute muted={musicMuted} onToggle={onToggleMusic} />
          <Copyright showLocation />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <BrandLink />
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="footer-more-menu"
          className="font-stoke text-[0.58rem] lowercase tracking-[0.18em] text-stone-500 transition duration-300 hover:text-stone-200"
        >
          {open ? 'less' : 'more'}
        </button>
      </div>
    </div>
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
      <footer className="mx-auto w-full max-w-[1400px] border-t border-white/10 pt-4 font-stoke text-[0.64rem] lowercase tracking-[0.14em] text-stone-500 sm:pt-4 sm:text-[0.68rem]">
        <FooterMoreMenu
          clock={clock}
          musicMuted={musicMuted}
          onToggleMusic={onToggleMusic}
          hideFrom="sm"
          showLetterBadge
        />

        <div className="hidden sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 sm:justify-self-start">
            <BrandLink />
            <span className="text-white/15" aria-hidden="true">
              ·
            </span>
            <NavLinks showLetterBadge={layout === 'home'} />
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
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:justify-end sm:justify-self-end">
            <MusicMute muted={musicMuted} onToggle={onToggleMusic} />
            <Copyright showLocation />
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="mt-16 border-t border-white/10 pt-4 font-stoke text-[0.68rem] lowercase tracking-[0.14em] text-stone-500 md:pt-6">
      <FooterMoreMenu
        clock={clock}
        musicMuted={musicMuted}
        onToggleMusic={onToggleMusic}
        hideFrom="md"
      />

      <div className="hidden flex-col gap-4 md:flex md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <BrandLink />
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
          <Copyright showLocation />
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
