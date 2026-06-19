import { useState } from 'react'
import {
  repathPublicLetterParagraphs,
  repathPublicLetterSignOff,
} from './hiddenContent'
import { navigate } from './router'
import {
  getRepathLetterView,
  setRepathLetterView,
  type RepathLetterView,
} from './repathLetterPref'

type RepathPublicLetterProps = {
  reading: boolean
  onListen: () => void
}

function RepathPublicLetter({ reading, onListen }: RepathPublicLetterProps) {
  const [view, setView] = useState<RepathLetterView>(getRepathLetterView)

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
              show letter
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
                ? 'one letter for everyone. read it, then write your own below.'
                : 'one letter for everyone. read it, hide it, then write your own below.'}
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

        <div
          className={`relative mt-10 md:mt-12 ${isPreview ? 'pb-8' : ''}`}
        >
          <article
            className={`space-y-6 ${
              isPreview
                ? 'letter-preview-mask max-h-[30vh] overflow-hidden md:max-h-[34vh]'
                : ''
            }`}
          >
            {repathPublicLetterParagraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="font-crimson text-[clamp(1.05rem,2.8vw,1.28rem)] leading-[1.62] text-stone-200"
              >
                {paragraph}
              </p>
            ))}
            {!isPreview && (
              <p className="pt-2 font-stoke text-[0.72rem] lowercase tracking-[0.18em] text-stone-500">
                {repathPublicLetterSignOff}
              </p>
            )}
          </article>

          {isPreview && (
            <div className="absolute inset-x-0 bottom-0 flex justify-center pb-1">
              <button
                type="button"
                onClick={() => updateView('expanded')}
                className="font-stoke text-[0.58rem] lowercase tracking-[0.18em] text-stone-500 transition duration-300 hover:text-stone-200"
              >
                read full letter
              </button>
            </div>
          )}
        </div>

        {!isPreview && (
          <button
            type="button"
            onClick={onListen}
            className="mt-10 font-stoke text-[0.58rem] lowercase tracking-[0.16em] text-stone-500 transition duration-300 hover:text-stone-200"
          >
            {reading ? 'reading' : 'listen'}
          </button>
        )}
      </div>
    </section>
  )
}

export default RepathPublicLetter
