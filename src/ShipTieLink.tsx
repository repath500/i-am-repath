import { navigate } from './router'

function ShipTieLink({ className = '' }: { className?: string }) {
  return (
    <a
      href="/working-on"
      onClick={(event) => {
        event.preventDefault()
        navigate('/working-on')
      }}
      className={`inline-block font-stoke text-[0.58rem] lowercase tracking-[0.16em] text-stone-600 transition duration-300 hover:text-stone-300 ${className}`}
    >
      this is why i ship →
    </a>
  )
}

export default ShipTieLink
