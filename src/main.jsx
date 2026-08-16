import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Warm the hero 3D chunk (three + react-three-fiber) so it downloads in
// parallel with the app bootstrap — otherwise it only starts after React
// mounts the hero scene, delaying the core visual on first visit.
import('./components/three/IdentityScene')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
