import { useState } from 'react'
import {
  repathPublicLetters,
  type RepathLetter,
} from './hiddenContent'
import { navigate } from './router'
import {
  getRepathLetterView,
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
}: {
  letter: RepathLetter
  isPreview: boolean
  onListen: () => void
  reading: boolean
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
          className="font-crimson text-[clamp(1.05rem,2.8vw,1.28rem)] leading-[1.62] text-stone-200"
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

function RepathPublicLetter({ readingLetterId, onListen }: RepathPublicLetterProps) {
  const [view, setView] = useState<RepathLetterView>(getRepathLetterView)
  const latestLetter = repathPublicLetters[repathPublicLetters.length - 1]

  const updateView = (next: RepathLetterView) => {
    setView(next)
    setRepathLetterView(next)
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
            <p className="font-stoke text-[0.62rem] lowercase tracking-[0.22em] text-stone-600">
              from repath
            </p>
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
            <p className="font-stoke text-[0.62rem] lowercase tracking-[0.22em] text-stone-600">
              from repath
            </p>
            <p className="mt-2 max-w-[42ch] font-crimson text-[1rem] italic leading-[1.5] text-stone-500 md:text-[1.05rem]">
              {isPreview
                ? `one letter for everyone${repathPublicLetters.length > 1 ? ` — ${repathPublicLetters.length} letters` : ''}. read it, then write your own below.`
                : `letters for everyone${repathPublicLetters.length > 1 ? ` — ${repathPublicLetters.length} in all` : ''}. read them, hide them, then write your own below.`}
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
          <div className="mt-10 space-y-16 md:mt-12 md:space-y-20">
            {repathPublicLetters.map((letter, index) => (
              <div
                key={letter.id}
                className={
                  index > 0 ? 'border-t border-white/10 pt-16 md:pt-20' : ''
                }
              >
                {repathPublicLetters.length > 1 && (
                  <p className="mb-8 font-stoke text-[0.58rem] lowercase tracking-[0.2em] text-stone-600">
                    letter {index + 1}
                  </p>
                )}
                <RepathLetterArticle
                  letter={letter}
                  isPreview={false}
                  onListen={() => onListen(letter)}
                  reading={readingLetterId === letter.id}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default RepathPublicLetter
