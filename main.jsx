import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App'
import './styles/globals.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const IS_VALID_KEY = !!PUBLISHABLE_KEY   // ✅ FIXED

if (!IS_VALID_KEY) {
  console.warn("⚠️ Clerk Publishable Key is missing or invalid. Authentication will be disabled.")
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {IS_VALID_KEY ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <BrowserRouter basename="/krish/">
          <App />
        </BrowserRouter>
      </ClerkProvider>
    ) : (
      <BrowserRouter basename="/krish/">
        <App />
      </BrowserRouter>
    )}
  </React.StrictMode>
)
