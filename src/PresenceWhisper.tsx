import { usePresence } from './usePresence'

function PresenceWhisper() {
  const visible = usePresence()

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 top-1/2 z-40 flex -translate-y-1/2 justify-center px-6 transition-opacity duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-live="polite"
      aria-hidden={!visible}
    >
      <p className="max-w-[28ch] text-center font-crimson text-[1.15rem] italic leading-[1.45] text-stone-400 md:text-[1.35rem]">
        you&apos;re not the only one awake right now.
      </p>
    </div>
  )
}

export default PresenceWhisper
