import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MidpointApp from './project/MidpointApp.jsx'

// 앱을 화면에 처음 띄우는 코드
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MidpointApp />
  </StrictMode>,
)
