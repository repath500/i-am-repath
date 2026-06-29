import { nowLine } from './ecosystem'

function NowLine({ className = '' }: { className?: string }) {
  return (
    <p
      className={`font-stoke text-[0.62rem] lowercase tracking-[0.14em] text-stone-500 ${className}`}
    >
      <span className="text-stone-600">{nowLine.label}</span>
      <span className="text-white/15 px-2" aria-hidden="true">
        ·
      </span>
      <span className="font-crimson text-[0.95rem] tracking-normal text-stone-400 md:text-[1rem]">
        {nowLine.text}
      </span>
    </p>
  )
}

export default NowLine
