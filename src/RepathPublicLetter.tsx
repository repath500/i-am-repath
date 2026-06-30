import { useState } from 'react'
import LetterBadge from './LetterBadge'
import {
  repathPublicLetters,
  type RepathLetter,
} from './hiddenContent'
import { navigate } from './router'
import {
  getLetterExpandedState,
  getRepathLetterView,
  setLetterExpanded,
  setRepathLetterView,
  type RepathLetterView,
} from './repathLetterPref'

type RepathPublicLetterProps = {
  readingLetterId: string | null
  onListen: (letter: RepathLetter) => void
}

function RepathLetterArticle({
  letter,
  isPreview,
  onListen,
  reading,
  compact = false,
}: {
  letter: RepathLetter
  isPreview: boolean
  onListen: () => void
  reading: boolean
  compact?: boolean
}) {
  return (
    <article
      className={`space-y-6 ${
        isPreview
          ? 'letter-preview-mask max-h-[30vh] overflow-hidden md:max-h-[34vh]'
          : ''
      }`}
    >
      {letter.paragraphs.map((paragraph) => (
        <p
          key={paragraph.slice(0, 32)}
          className={
            compact
              ? 'font-crimson text-[clamp(0.92rem,2.2vw,1.05rem)] leading-[1.58] text-stone-500'
              : 'font-crimson text-[clamp(1.05rem,2.8vw,1.28rem)] leading-[1.62] text-stone-200'
          }
        >
          {paragraph}
        </p>
      ))}
      {!isPreview && (
        <>
          <p className="pt-2 font-stoke text-[0.72rem] lowercase tracking-[0.18em] text-stone-500">
            {letter.signOff}
          </p>
          <button
            type="button"
            onClick={onListen}
            className="font-stoke text-[0.58rem] lowercase tracking-[0.16em] text-stone-500 transition duration-300 hover:text-stone-200"
          >
            {reading ? 'reading' : 'listen'}
          </button>
        </>
      )}
    </article>
  )
}

function CollapsedLetterPeek({
  letter,
  index,
  onExpand,
}: {
  letter: RepathLetter
  index: number
  onExpand: () => void
}) {
  return (
    <div className="rounded border border-white/8 bg-white/[0.02] px-4 py-4 md:px-5 md:py-5">
      <div className="flex items-center justify-between gap-4">
        <p className="font-stoke text-[0.58rem] lowercase tracking-[0.2em] text-stone-600">
          letter {index + 1}
        </p>
        <button
          type="button"
          onClick={onExpand}
          className="font-stoke text-[0.58rem] lowercase tracking-[0.16em] text-stone-500 transition duration-300 hover:text-stone-200"
        >
          read full letter
        </button>
      </div>
      <p className="mt-4 font-crimson text-[clamp(0.92rem,2.4vw,1.02rem)] italic leading-[1.55] text-stone-500">
        {letter.paragraphs[0]}
      </p>
      {letter.paragraphs[1] ? (
        <div className="letter-preview-mask mt-3 max-h-[3.8rem] overflow-hidden">
          <p className="font-crimson text-[clamp(0.86rem,2.1vw,0.96rem)] leading-[1.55] text-stone-600">
            {letter.paragraphs[1]}
          </p>
        </div>
      ) : null}
    </div>
  )
}

function RepathPublicLetter({ readingLetterId, onListen }: RepathPublicLetterProps) {
  const [view, setView] = useState<RepathLetterView>(getRepathLetterView)
  const [expandedLetters, setExpandedLetters] = useState(getLetterExpandedState)
  const latestLetter = repathPublicLetters[repathPublicLetters.length - 1]
  const orderedLetters = [...repathPublicLetters].reverse()

  const updateView = (next: RepathLetterView) => {
    setView(next)
    setRepathLetterView(next)
  }

  const toggleLetterExpanded = (letterId: string, expanded: boolean) => {
    setExpandedLetters((current) => ({ ...current, [letterId]: expanded }))
    setLetterExpanded(letterId, expanded)
  }

  if (view === 'hidden') {
    return (
      <section>
        <div className="mx-auto max-w-[760px] px-5 pt-12 sm:px-6 md:pt-16">
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
          <div className="mt-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <p className="font-stoke text-[0.62rem] lowercase tracking-[0.22em] text-stone-600">
                from repath
              </p>
              {repathPublicLetters.length > 1 ? (
                <LetterBadge>{`letter ${repathPublicLetters.length}`}</LetterBadge>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => updateView('expanded')}
              className="font-stoke text-[0.58rem] lowercase tracking-[0.16em] text-stone-500 transition duration-300 hover:text-stone-200"
            >
              show {repathPublicLetters.length > 1 ? 'letters' : 'letter'}
            </button>
          </div>
        </div>
      </section>
    )
  }

  const isPreview = view === 'preview'

  return (
    <section>
      <div className="mx-auto max-w-[760px] px-5 pt-12 sm:px-6 md:pt-16">
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

        <div className="mt-10 flex items-start justify-between gap-4 md:mt-12">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-stoke text-[0.62rem] lowercase tracking-[0.22em] text-stone-600">
                from repath
              </p>
              {repathPublicLetters.length > 1 ? (
                <LetterBadge>{`letter ${repathPublicLetters.length}`}</LetterBadge>
              ) : null}
            </div>
            <p className="mt-2 max-w-[42ch] font-crimson text-[1rem] italic leading-[1.5] text-stone-500 md:text-[1.05rem]">
              {isPreview
                ? 'read the latest letter, then write your own below.'
                : 'read the latest letter first. earlier ones stay here if you want them.'}
            </p>
          </div>
          {!isPreview && (
            <button
              type="button"
              onClick={() => updateView('hidden')}
              className="shrink-0 font-stoke text-[0.58rem] lowercase tracking-[0.16em] text-stone-600 transition duration-300 hover:text-stone-300"
            >
              hide
            </button>
          )}
        </div>

        {isPreview ? (
          <div className="relative mt-10 pb-8 md:mt-12">
            <div className="mb-4 flex items-center gap-2">
              <p className="font-stoke text-[0.58rem] lowercase tracking-[0.2em] text-stone-600">
                letter {repathPublicLetters.length}
              </p>
              <LetterBadge>latest</LetterBadge>
            </div>
            <RepathLetterArticle
              letter={latestLetter}
              isPreview
              onListen={() => {}}
              reading={false}
            />
            <div className="absolute inset-x-0 bottom-0 flex justify-center pb-1">
              <button
                type="button"
                onClick={() => updateView('expanded')}
                className="font-stoke text-[0.58rem] lowercase tracking-[0.18em] text-stone-500 transition duration-300 hover:text-stone-200"
              >
                read full {repathPublicLetters.length > 1 ? 'letters' : 'letter'}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-10 space-y-10 md:mt-12 md:space-y-12">
            {orderedLetters.map((letter) => {
              const index = repathPublicLetters.findIndex((item) => item.id === letter.id)
              const isLatest = letter.id === latestLetter.id
              const isExpanded = expandedLetters[letter.id] ?? isLatest

              if (!isExpanded) {
                return (
                  <CollapsedLetterPeek
                    key={letter.id}
                    letter={letter}
                    index={index}
                    onExpand={() => toggleLetterExpanded(letter.id, true)}
                  />
                )
              }

              return (
                <div
                  key={letter.id}
                  className={!isLatest ? 'border-t border-white/10 pt-10 md:pt-12' : ''}
                >
                  <div className="mb-8 flex flex-wrap items-center gap-2">
                    <p className="font-stoke text-[0.58rem] lowercase tracking-[0.2em] text-stone-600">
                      letter {index + 1}
                    </p>
                    {isLatest ? <LetterBadge>latest</LetterBadge> : (
                      <button
                        type="button"
                        onClick={() => toggleLetterExpanded(letter.id, false)}
                        className="font-stoke text-[0.58rem] lowercase tracking-[0.16em] text-stone-600 transition duration-300 hover:text-stone-300"
                      >
                        collapse
                      </button>
                    )}
                  </div>
                  <RepathLetterArticle
                    letter={letter}
                    isPreview={false}
                    onListen={() => onListen(letter)}
                    reading={readingLetterId === letter.id}
                    compact={!isLatest}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default RepathPublicLetter
