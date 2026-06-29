import { repathPublicLetterParagraphs } from './hiddenContent'
import { navigate } from './router'

const bodyText =
  'font-crimson text-[1.13rem] leading-[1.65] text-stone-300 md:text-[1.2rem] md:leading-[1.68]'

function LetterTeaser() {
  const opener = repathPublicLetterParagraphs[0]
  const closer = repathPublicLetterParagraphs.slice(-2).join(' ')

  return (
    <section className="note-row mt-16 border-t border-white/10 pt-12 md:mt-20 md:pt-16">
      <p className="font-stoke text-[0.65rem] lowercase tracking-[0.24em] text-stone-500">
        the letter
      </p>

      <p className={`mt-6 max-w-[58ch] italic text-stone-200 ${bodyText}`}>{opener}</p>

      <p className={`mt-4 max-w-[58ch] text-stone-400 ${bodyText}`}>{closer}</p>

      <a
        href="/letter"
        onClick={(event) => {
          event.preventDefault()
          navigate('/letter')
        }}
        className="mt-8 inline-block border-b border-white/25 pb-1 font-stoke text-[clamp(1rem,3vw,1.15rem)] lowercase text-stone-300 transition duration-300 hover:border-white/55 hover:text-stone-100"
      >
        read the full letter
      </a>
    </section>
  )
}

export default LetterTeaser
