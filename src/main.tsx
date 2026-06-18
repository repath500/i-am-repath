import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Letter from './Letter.tsx'
import Notes from './Notes.tsx'
import { useRoute } from './router'

function Root() {
  const route = useRoute()

  if (route.page === 'letter') {
    return <Letter deliveryId={route.deliveryId} />
  }

  if (route.page === 'notes') {
    return <Notes initialNoteIndex={route.noteIndex} />
  }

  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
