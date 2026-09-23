import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { reloadFresh, stripReloadParam } from './lib/staleDeploy'

// Clean up before the router reads the URL.
stripReloadParam()

// Vite fires this when a lazy chunk can't load (typically deleted by a newer deploy).
// Reloading fetches the current index.html; preventDefault stops the error from surfacing.
window.addEventListener('vite:preloadError', (event) => {
  if (reloadFresh()) event.preventDefault()
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
