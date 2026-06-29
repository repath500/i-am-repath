import { useEffect, useState } from 'react'
import { identity } from './ecosystem'

function IdentityWhisper() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const showTimer = window.setTimeout(() => setVisible(true), 4200)
    const hideTimer = window.setTimeout(() => setVisible(false), 10000)
    return () => {
      window.clearTimeout(showTimer)
      window.clearTimeout(hideTimer)
    }
  }, [])

  return (
    <p
      className={`pointer-events-none fixed inset-x-0 top-[18%] z-[15] flex justify-center px-6 transition-opacity duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden={!visible}
    >
      <span className="max-w-[34ch] text-center font-crimson text-[1.05rem] italic leading-[1.45] text-stone-500 md:text-[1.2rem]">
        {identity.rayRepath}
      </span>
    </p>
  )
}

export default IdentityWhisper
