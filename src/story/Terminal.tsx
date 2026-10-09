import { useEffect, useRef, useState, type FormEvent } from 'react'

const HELP = `commands
  whoami
  finish
  ls
  gaeilge
  clear
  exit`

const replyFor = (input: string, gaeilge: boolean) => {
  const command = input.trim().toLowerCase()
  if (!command) return ''
  if (command === 'help') return HELP
  if (command === 'whoami') return gaeilge ? 'is mise repath. ray do dhaoine áirithe.' : 'repath. ray to some.'
  if (command === 'ls' || command === 'ls work/') return 'critique  dáildex  leemerchat  leemerlabs  warren'
  if (command.startsWith('finish') || command.startsWith('critique')) {
    return `outcome        in_progress
evidence       2,500+ commits, 11 films, 2 letters
limits         still in the middle
exit 0`
  }
  if (command === 'gaeilge') return 'gaeilge on. type it again to switch back.'
  if (command === 'clear') return ''
  if (command === 'exit') return ''
  return `crit says: unknown command "${command}". try help.`
}

function Terminal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [lines, setLines] = useState<string[]>(['the night shift terminal. type help.', ''])
  const [value, setValue] = useState('')
  const [gaeilge, setGaeilge] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  if (!open) return null

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const command = value.trim().toLowerCase()
    if (command === 'exit') {
      onClose()
      setValue('')
      return
    }
    if (command === 'clear') {
      setLines([])
      setValue('')
      return
    }
    if (command === 'gaeilge') setGaeilge((current) => !current)
    const reply = replyFor(value, command === 'gaeilge' ? !gaeilge : gaeilge)
    setLines((current) => [...current, `$ ${value}`, reply, ''])
    setValue('')
  }

  return (
    <div className="terminal" role="dialog" aria-label="night shift terminal">
      <div className="terminal-bar">
        <span>critique · the night shift</span>
        <button type="button" onClick={onClose}>
          close
        </button>
      </div>
      <pre className="terminal-log">{lines.join('\n')}</pre>
      <form onSubmit={submit}>
        <span aria-hidden="true">$</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-label="terminal command"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </form>
    </div>
  )
}

export default Terminal
