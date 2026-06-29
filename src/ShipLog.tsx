import { shipLog } from './ecosystem'

function ShipLog() {
  return (
    <section className="note-row mt-16 border-t border-white/10 pt-12 md:mt-20 md:pt-16">
      <p className="font-stoke text-[0.65rem] lowercase tracking-[0.24em] text-stone-500">
        ship log
      </p>
      <p className="mt-4 max-w-[58ch] font-crimson text-[1.05rem] leading-[1.65] text-stone-500 md:text-[1.1rem]">
        not a blog. a ledger. date and one line.
      </p>
      <ol className="mt-8 space-y-0">
        {shipLog.map((entry) => (
          <li
            key={`${entry.date}-${entry.line.slice(0, 24)}`}
            className="flex gap-4 border-t border-white/[0.06] py-4 first:border-t-0 first:pt-0"
          >
            <span className="shrink-0 font-stoke text-[0.62rem] lowercase tabular-nums tracking-[0.12em] text-stone-600">
              {entry.date}
            </span>
            <span className="font-crimson text-[1.05rem] leading-[1.55] text-stone-300 md:text-[1.1rem]">
              {entry.line}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default ShipLog
