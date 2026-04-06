import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/Navbar'
import Chatbot from './components/Chatbot'
import Dashboard from './pages/Dashboard'
import Advisory from './pages/Advisory'
import Market from './pages/Market'
import ImageAnalysis from './pages/ImageAnalysis'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Navbar />
        <div className="page-wrapper">
          <Routes>
            <Route path="/"        element={<Dashboard />} />
            <Route path="/advisory" element={<Advisory />} />
            <Route path="/market"   element={<Market />} />
            <Route path="/image"    element={<ImageAnalysis />} />
          </Routes>
        </div>
        <Chatbot />
      </ToastProvider>
    </AuthProvider>
  )
}
