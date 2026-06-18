type MusicMuteProps = {
  muted: boolean
  onToggle: () => void
  className?: string
}

function MusicMute({ muted, onToggle, className }: MusicMuteProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={muted}
      aria-label={muted ? 'turn background music on' : 'turn background music off'}
      className={
        className ??
        'font-stoke text-[0.58rem] lowercase tracking-[0.2em] text-stone-600 transition duration-300 hover:text-stone-300'
      }
    >
      {muted ? 'music on' : 'music off'}
    </button>
  )
}

export default MusicMute
