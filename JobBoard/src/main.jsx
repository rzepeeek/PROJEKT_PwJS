// plik stanowi punkt wejscia aplikacji odpowiada za uruchomienie projektu React i wyrenderowanie glownego komponentu App

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// punkt startowy aplikacji React
createRoot(document.getElementById('root')).render(
  // renderowanie glownego komponentu aplikacji
  <StrictMode>
    <App />
  </StrictMode>,
)
