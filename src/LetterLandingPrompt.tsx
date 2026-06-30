import { repathPublicLetters } from './hiddenContent'
import LetterBadge from './LetterBadge'
import { navigate } from './router'

function LetterLandingPrompt() {
  const latestLetter = repathPublicLetters[repathPublicLetters.length - 1]
  const opener = latestLetter.paragraphs[0]

  return (
    <section className="mx-auto w-full max-w-[1400px] border-t border-white/10 px-4 pt-6 sm:px-6 md:px-10">
      <a
        href="/letter"
        onClick={(event) => {
          event.preventDefault()
          navigate('/letter')
        }}
        className="group block max-w-[58ch]"
      >
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-stoke text-[0.58rem] lowercase tracking-[0.22em] text-stone-600">
            from repath
          </p>
          {repathPublicLetters.length > 1 ? (
            <LetterBadge>{`letter ${repathPublicLetters.length}`}</LetterBadge>
          ) : null}
        </div>
        <p className="mt-3 font-crimson text-[1rem] italic leading-[1.55] text-stone-400 transition duration-300 group-hover:text-stone-300 md:text-[1.05rem]">
          {opener}
        </p>
        <span className="mt-3 inline-block font-stoke text-[0.62rem] lowercase tracking-[0.16em] text-stone-500 transition duration-300 group-hover:text-stone-300">
          read letter {repathPublicLetters.length}
        </span>
      </a>
    </section>
  )
}

export default LetterLandingPrompt
