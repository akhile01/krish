import { Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import Dashboard from './pages/Dashboard'
import Advisory from './pages/Advisory'
import Market from './pages/Market'
import ImageAnalysis from './pages/ImageAnalysis'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const AUTH_ENABLED = CLERK_KEY && CLERK_KEY !== 'pk_test_...'

export default function App() {
  return (
    <ToastProvider>
      <Navbar />
      <div className="page-wrapper">
        <Routes>
          {/* Public Routes */}
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />

          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              AUTH_ENABLED ? (
                <>
                  <SignedIn><Dashboard /></SignedIn>
                  <SignedOut><RedirectToSignIn /></SignedOut>
                </>
              ) : <Dashboard />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              AUTH_ENABLED ? (
                <>
                  <SignedIn><Dashboard /></SignedIn>
                  <SignedOut><RedirectToSignIn /></SignedOut>
                </>
              ) : <Dashboard />
            } 
          />
          <Route 
            path="/advisory" 
            element={
              AUTH_ENABLED ? (
                <>
                  <SignedIn><Advisory /></SignedIn>
                  <SignedOut><RedirectToSignIn /></SignedOut>
                </>
              ) : <Advisory />
            } 
          />
          <Route 
            path="/market" 
            element={
              AUTH_ENABLED ? (
                <>
                  <SignedIn><Market /></SignedIn>
                  <SignedOut><RedirectToSignIn /></SignedOut>
                </>
              ) : <Market />
            } 
          />
          <Route 
            path="/image" 
            element={
              AUTH_ENABLED ? (
                <>
                  <SignedIn><ImageAnalysis /></SignedIn>
                  <SignedOut><RedirectToSignIn /></SignedOut>
                </>
              ) : <ImageAnalysis />
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Chatbot />
      <Footer />
    </ToastProvider>
  )
}
