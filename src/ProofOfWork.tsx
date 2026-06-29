import { useEffect, useState } from 'react'
import { GitHubCalendar } from 'react-github-calendar'
import 'react-activity-calendar/tooltips.css'
import { fetchContributionRhythm } from './contributionsRhythm'

const calendarTheme = {
  dark: [
    'rgba(255, 255, 255, 0.04)',
    '#0e4429',
    '#006d32',
    '#26a641',
    '#39d353',
  ],
}

export default function ProofOfWork() {
  const [rhythm, setRhythm] = useState<string | null>(null)

  useEffect(() => {
    fetchContributionRhythm().then(setRhythm)
  }, [])

  return (
    <section className="note-row mt-16 border-t border-white/10 pt-12 md:mt-20 md:pt-16">
      <p className="font-stoke text-[0.65rem] lowercase tracking-[0.24em] text-stone-500">
        proof of work
      </p>

      <h2 className="mt-6 font-stoke text-[clamp(1.8rem,5.5vw,2.6rem)] font-light lowercase leading-none tracking-[-0.01em] text-stone-100">
        github is the receipts.
      </h2>

      <p className="mt-6 max-w-[58ch] font-crimson text-[1.13rem] leading-[1.65] text-stone-300 md:text-[1.2rem] md:leading-[1.68]">
        over two and a half thousand commits in the past year across critique,
        leemerchat, leemerlabs, warren, and the systems behind them.
      </p>

      <div className="proof-of-work-calendar mt-10 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02] px-4 py-5 sm:px-5 sm:py-6">
        <GitHubCalendar
          username="repath500"
          colorScheme="dark"
          theme={calendarTheme}
          fontSize={11}
          blockSize={11}
          blockMargin={3}
          blockRadius={2}
          showWeekdayLabels={false}
          labels={{
            totalCount: '{{count}} contributions in the last year',
            legend: { less: 'less', more: 'more' },
          }}
        />
      </div>

      {rhythm ? (
        <p className="mt-4 font-stoke text-[0.62rem] lowercase tracking-[0.16em] text-stone-600">
          last seven days:{' '}
          <span className="font-crimson text-[0.95rem] tracking-normal text-stone-400">
            {rhythm}
          </span>
        </p>
      ) : null}

      <p className="mt-6 max-w-[58ch] font-crimson text-[1.05rem] leading-[1.65] text-stone-400 md:text-[1.1rem]">
        some commits become products. some become infrastructure. some become
        lessons. the pattern is simple: ship, break, learn, rebuild.
      </p>
    </section>
  )
}
