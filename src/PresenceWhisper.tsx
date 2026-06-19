import { usePresence } from './usePresence'

function PresenceWhisper() {
  const message = usePresence()

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 top-1/2 z-40 flex -translate-y-1/2 justify-center px-6 transition-opacity duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        message ? 'opacity-100' : 'opacity-0'
      }`}
      aria-live="polite"
      aria-hidden={!message}
    >
      <p className="max-w-[32ch] text-center font-crimson text-[1.15rem] italic leading-[1.45] text-stone-400 md:text-[1.35rem]">
        {message}
      </p>
    </div>
  )
}

export default PresenceWhisper
