import { useEffect, useState } from 'react'
import { hasShownRespect, markRespectShown } from './progress'
import { useActiveTime } from './useActiveTime'

function RespectWhisper() {
  const earned = useActiveTime()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!earned || hasShownRespect()) return

    setVisible(true)
    markRespectShown()
    const timer = window.setTimeout(() => setVisible(false), 9000)
    return () => window.clearTimeout(timer)
  }, [earned])

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center px-6 transition-opacity duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:bottom-16 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-live="polite"
      aria-hidden={!visible}
    >
      <p className="max-w-[30ch] text-center font-crimson text-[1.05rem] italic leading-[1.45] text-stone-500 md:text-[1.2rem]">
        most people leave earlier. you didn&apos;t.
      </p>
    </div>
  )
}

export default RespectWhisper
