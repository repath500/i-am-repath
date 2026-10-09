import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Letter from './Letter.tsx'
import Lost from './story/Lost.tsx'
import Notes from './Notes.tsx'
import RespectWhisper from './RespectWhisper.tsx'
import StoryPage from './story/StoryPage.tsx'
import WorkingOn from './WorkingOn.tsx'
import { useRoute } from './router'

function Root() {
  const route = useRoute()

  return (
    <>
      <RespectWhisper />
      {route.page === 'letter' ? (
        <Letter deliveryId={route.deliveryId} />
      ) : route.page === 'notes' ? (
        <Notes initialNoteIndex={route.noteIndex} />
      ) : route.page === 'working-on' ? (
        <WorkingOn />
      ) : route.page === 'lost' ? (
        <Lost />
      ) : (
        <StoryPage />
      )}
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
