import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import GrainNames from './GrainNames.tsx'
import Letter from './Letter.tsx'
import Notes from './Notes.tsx'
import RespectWhisper from './RespectWhisper.tsx'
import { useRoute } from './router'

function Root() {
  const route = useRoute()

  return (
    <>
      <GrainNames />
      <RespectWhisper />
      {route.page === 'letter' ? (
        <Letter deliveryId={route.deliveryId} />
      ) : route.page === 'notes' ? (
        <Notes initialNoteIndex={route.noteIndex} />
      ) : (
        <App />
      )}
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
