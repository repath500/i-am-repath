function LetterBadge({ children }: { children: string | number }) {
  return (
    <span className="inline-flex items-center rounded border border-white/15 px-2 py-0.5 font-stoke text-[0.52rem] lowercase tracking-[0.16em] text-stone-400">
      {children}
    </span>
  )
}

export default LetterBadge
