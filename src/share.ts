import { notes } from './notes'
import { getNoteSharePath } from './router'

export const getNoteShareUrl = (noteIndex: number) => {
  if (typeof window === 'undefined') return getNoteSharePath(noteIndex)
  return `${window.location.origin}${getNoteSharePath(noteIndex)}`
}

export const updateNoteMeta = (noteIndex: number) => {
  const note = notes[noteIndex]
  if (!note || typeof document === 'undefined') return

  const excerpt =
    note.text.length > 140 ? `${note.text.slice(0, 137).trim()}…` : note.text

  document.title = `${excerpt} — repath.life`

  const setMeta = (selector: string, content: string) => {
    const element = document.querySelector(selector)
    if (element) element.setAttribute('content', content)
  }

  setMeta('meta[name="description"]', excerpt)
  setMeta('meta[property="og:title"]', excerpt)
  setMeta('meta[property="og:description"]', 'a note from repath.life')
  setMeta('meta[property="og:url"]', getNoteShareUrl(noteIndex))
  setMeta('meta[name="twitter:title"]', excerpt)
  setMeta('meta[name="twitter:description"]', 'a note from repath.life')
}

export const updateWorkingOnMeta = () => {
  if (typeof document === 'undefined') return

  const title = 'what i\'m working on — repath.life'
  const description =
    'repath khan builds ai products for developers and founders — critique, leemerchat, and leemerlabs.'

  document.title = title

  const setMeta = (selector: string, content: string) => {
    const element = document.querySelector(selector)
    if (element) element.setAttribute('content', content)
  }

  setMeta('meta[name="description"]', description)
  setMeta('meta[property="og:title"]', title)
  setMeta('meta[property="og:description"]', description)
  setMeta('meta[property="og:url"]', 'https://repath.life/working-on')
  setMeta('meta[name="twitter:title"]', title)
  setMeta('meta[name="twitter:description"]', description)
}

export const resetSiteMeta = () => {
  if (typeof document === 'undefined') return

  document.title = 'repath.life — a record of becoming'

  const setMeta = (selector: string, content: string) => {
    const element = document.querySelector(selector)
    if (element) element.setAttribute('content', content)
  }

  const description =
    'a record of becoming. a quiet, ever-changing frame and a note left after it.'

  setMeta('meta[name="description"]', description)
  setMeta('meta[property="og:title"]', 'repath.life — a record of becoming')
  setMeta('meta[property="og:description"]', description)
  setMeta('meta[property="og:url"]', 'https://repath.life/')
  setMeta('meta[name="twitter:title"]', 'repath.life — a record of becoming')
  setMeta('meta[name="twitter:description"]', description)
}

export const shareNote = async (noteIndex: number) => {
  const note = notes[noteIndex]
  if (!note) return 'unsupported'

  const url = getNoteShareUrl(noteIndex)
  const excerpt =
    note.text.length > 120 ? `${note.text.slice(0, 117).trim()}…` : note.text

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'a note',
        text: excerpt,
        url,
      })
      return 'shared'
    } catch {
      return 'cancelled'
    }
  }

  try {
    await navigator.clipboard.writeText(url)
    return 'copied'
  } catch {
    return 'unsupported'
  }
}
