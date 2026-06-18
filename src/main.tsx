import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Notes from './Notes.tsx'
import { useRoute } from './router'

function Root() {
  const path = useRoute()
  return path === '/notes' ? <Notes /> : <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
