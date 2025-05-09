import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import 'bootstrap/dist/css/bootstrap.min.css' // Add Bootstrap CSS here

createRoot(document.getElementById('root')).render(
  /*   <StrictMode>
      <App />
    </StrictMode> */
  <AuthProvider>
    <App />
  </AuthProvider>,
)
