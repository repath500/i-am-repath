import { nowLine } from './ecosystem'

function NowLine({ className = '' }: { className?: string }) {
  return (
    <p
      className={`flex flex-col gap-1.5 font-stoke text-[0.62rem] lowercase tracking-[0.14em] text-stone-500 sm:flex-row sm:items-baseline sm:gap-0 ${className}`}
    >
      <span className="shrink-0 text-stone-600">{nowLine.label}</span>
      <span className="hidden text-white/15 px-2 sm:inline" aria-hidden="true">
        ·
      </span>
      <span className="font-crimson text-[1rem] leading-[1.5] tracking-normal text-stone-400">
        {nowLine.text}
      </span>
    </p>
  )
}

export default NowLine
