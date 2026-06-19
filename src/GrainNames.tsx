import { useEffect, useState } from 'react'

const VISITOR_KEY = 'repath:visitor-id'
const NAME_PREF_KEY = 'repath:name-pref:v1'

type NamePref = {
  name: string
  visible: boolean
  id: string
}

const hash = (value: string) => {
  let h = 0
  for (let i = 0; i < value.length; i += 1) {
    h = (h << 5) - h + value.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

const loadPref = (): NamePref | null => {
  try {
    const raw = localStorage.getItem(NAME_PREF_KEY)
    return raw ? (JSON.parse(raw) as NamePref) : null
  } catch {
    return null
  }
}

const savePref = (pref: NamePref) => {
  localStorage.setItem(NAME_PREF_KEY, JSON.stringify(pref))
}

const getVisitorId = () => {
  let id = localStorage.getItem(VISITOR_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(VISITOR_KEY, id)
  }
  return id
}

function GrainNames() {
  const [names, setNames] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(loadPref()?.name ?? '')
  const [visible, setVisible] = useState(loadPref()?.visible ?? false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/names')
        if (!response.ok) return
        const data = (await response.json()) as { names?: string[] }
        setNames(data.names ?? [])
      } catch {
        // optional feature
      }
    }

    load()
    const interval = window.setInterval(load, 45_000)
    return () => window.clearInterval(interval)
  }, [saved])

  const submit = async () => {
    const trimmed = draft.trim().slice(0, 24)
    const id = loadPref()?.id ?? getVisitorId()

    try {
      await fetch('/api/names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name: trimmed,
          visible: visible && trimmed.length > 0,
        }),
      })
      savePref({ id, name: trimmed, visible: visible && trimmed.length > 0 })
      setSaved(true)
      setOpen(false)
    } catch {
      // ignore
    }
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden" aria-hidden="true">
        {names.map((name) => {
          const seed = hash(name)
          const top = 8 + (seed % 8200) / 100
          const left = 4 + ((seed >> 4) % 9000) / 100
          return (
            <span
              key={name}
              className="absolute font-stoke text-[0.55rem] lowercase tracking-[0.22em] text-stone-100/[0.07]"
              style={{ top: `${top}%`, left: `${left}%` }}
            >
              {name}
            </span>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="fixed bottom-5 left-5 z-30 font-stoke text-[0.55rem] lowercase tracking-[0.2em] text-stone-600 transition duration-300 hover:text-stone-300"
      >
        {loadPref()?.visible ? loadPref()?.name : 'leave a name'}
      </button>

      {open && (
        <div className="fixed bottom-14 left-5 z-30 w-[min(88vw,260px)] border border-white/12 bg-[#050505]/95 p-4 backdrop-blur-sm">
          <p className="font-stoke text-[0.58rem] lowercase tracking-[0.18em] text-stone-500">
            appear in the grain
          </p>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="first name"
            maxLength={24}
            className="mt-3 w-full border-b border-white/12 bg-transparent pb-2 font-crimson text-[1.1rem] text-stone-200 outline-none placeholder:text-stone-600 focus:border-white/30"
          />
          <label className="mt-4 flex items-center gap-2 font-stoke text-[0.58rem] lowercase tracking-[0.14em] text-stone-500">
            <input
              type="checkbox"
              checked={visible}
              onChange={(event) => setVisible(event.target.checked)}
              className="accent-stone-400"
            />
            show to others visiting
          </label>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={submit}
              className="font-stoke text-[0.58rem] lowercase tracking-[0.16em] text-stone-300 transition hover:text-stone-100"
            >
              save
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-stoke text-[0.58rem] lowercase tracking-[0.16em] text-stone-600 transition hover:text-stone-400"
            >
              close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default GrainNames
