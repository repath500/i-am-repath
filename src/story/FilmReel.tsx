import { useMemo, useRef, useState } from 'react'
import { notes, type Note } from '../notes'
import { frames, type Frame } from './films'

const shuffle = <T,>(input: T[]): T[] => {
  const arr = [...input]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function FilmReel() {
  const queue = useRef<Frame[] | null>(null)
  const [frame, setFrame] = useState<Frame>(
    () => frames[Math.floor(Math.random() * frames.length)],
  )
  const [note, setNote] = useState<Note>(() => notes[Math.floor(Math.random() * notes.length)])
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [ended, setEnded] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const develop = ended ? 1 : progress

  const nextNote = (exclude: string) => {
    const pool = notes.filter((item) => item.text !== exclude)
    return pool[Math.floor(Math.random() * pool.length)]
  }

  const play = async () => {
    const video = videoRef.current
    if (!video) return
    video.muted = false
    try {
      await video.play()
      setBlocked(false)
    } catch {
      video.muted = true
      await video.play().catch(() => {})
      setBlocked(true)
    }
  }

  const enableSound = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = false
    video.play().then(() => setBlocked(false)).catch(() => setBlocked(true))
  }

  const replay = () => {
    const video = videoRef.current
    if (!video) return
    setEnded(false)
    setProgress(0)
    video.currentTime = 0
    play()
  }

  const another = () => {
    if (!queue.current || queue.current.length === 0) {
      queue.current = shuffle(frames.filter((item) => item.id !== frame.id))
    }
    const next = queue.current.shift() as Frame
    setNote((current) => nextNote(current.text))
    setEnded(false)
    setReady(false)
    setPlaying(false)
    setProgress(0)
    setBlocked(false)
    setFrame(next)
  }

  const label = useMemo(() => {
    const index = frames.findIndex((item) => item.id === frame.id) + 1
    return String(index).padStart(2, '0')
  }, [frame.id])

  return (
    <div className="reel">
      <div className="reel-stage">
        <video
          key={frame.id}
          ref={videoRef}
          className={ready ? 'is-ready' : ''}
          playsInline
          preload="metadata"
          poster=""
          onCanPlay={() => setReady(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={() => {
            const video = videoRef.current
            if (video?.duration) setProgress(Math.min(1, video.currentTime / video.duration))
          }}
          onEnded={() => {
            setPlaying(false)
            setProgress(1)
            setEnded(true)
          }}
        >
          <source src={frame.src} />
        </video>
        <div className="reel-beam" aria-hidden="true" />
        {ready && !ended && (
          <button type="button" className="reel-hit" onClick={() => (playing ? videoRef.current?.pause() : play())} aria-label={playing ? 'pause film' : 'play film'}>
            {!playing && <span>play</span>}
          </button>
        )}
        {blocked && (
          <button type="button" className="reel-sound" onClick={enableSound}>
            tap for sound
          </button>
        )}
        {ended && (
          <div className="reel-ended">
            <button type="button" onClick={replay}>replay</button>
            <span aria-hidden="true">·</span>
            <button type="button" onClick={another}>another reel</button>
          </div>
        )}
      </div>
      <div className="reel-meta">
        <span>reel {label}</span>
        <span>{frame.title}</span>
      </div>
      <p
        className="reel-note"
        style={{
          filter: `blur(${(1 - develop) * 8}px)`,
          opacity: 0.15 + develop * 0.85,
          transform: `translateY(${(1 - develop) * 16}px)`,
        }}
      >
        {note.text}
      </p>
    </div>
  )
}

export default FilmReel
