import { useState, useRef, useEffect } from 'react'
import { db } from '../firebase'
import { collection, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { useUser } from '@clerk/clerk-react'
import { sendMessageToAI } from '../services/chatService'
import { useToast } from '../context/ToastContext'

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const AUTH_ENABLED = CLERK_KEY && CLERK_KEY !== 'pk_test_...'

const QUICK_REPLIES = [
  'Suggest best crops 🌱',
  'Is it going to rain? 🌦️',
  'Check market price 📈',
  'How to detect pests? 🐛',
]

/**
 * Chatbot Component
 * A premium AI-powered chatbot for KrishiAI with Voice Assistant capabilities.
 */
export default function Chatbot({ isFloating = true }) {
  const { user } = AUTH_ENABLED ? useUser() : { user: null }
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Namaste! 🙏 I'm your KrishiAI assistant. How can I help you today?" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const scrollRef = useRef(null)
  const { addToast } = useToast()

  // 🔊 Text to Speech (TTS)
  const speak = (message) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const speech = new SpeechSynthesisUtterance(message)
    speech.lang = 'en-US'
    speech.rate = 1.0
    window.speechSynthesis.speak(speech)
  }

  // 🎤 Speech to Text (STT)
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      addToast('Speech Recognition not supported 🚫', 'error')
      return
    }

    const recog = new SpeechRecognition()
    recog.lang = 'en-US'
    recog.onstart = () => setIsListening(true)
    recog.onend = () => setIsListening(false)
    recog.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      if (transcript) handleSend(transcript, true)
    }
    recog.start()
  }

  // Load chat from Firestore
  useEffect(() => {
    if (user) {
      const loadChat = async () => {
        const docRef = doc(db, 'chats', user.id)
        const d = await getDoc(docRef)
        if (d.exists() && d.data().messages) setMessages(d.data().messages)
      }
      loadChat()
    }
  }, [user])

  // Save chat to Firestore
  useEffect(() => {
    if (user && messages.length > 1) {
      const saveChat = async () => {
        await setDoc(doc(db, 'chats', user.id), {
          uid: user.id,
          messages,
          updatedAt: serverTimestamp()
        })
      }
      saveChat()
    }
  }, [messages, user])

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSend = async (text = input, fromVoice = false) => {
    const trimmedText = text.trim()
    if (!trimmedText || isLoading) return

    setMessages(prev => [...prev, { type: 'user', text: trimmedText }])
    setInput('')
    setIsLoading(true)

    try {
      const response = await sendMessageToAI(trimmedText)
      const botMsg = { type: 'bot', text: response.text }
      setMessages(prev => [...prev, botMsg])
      if (fromVoice) speak(response.text)
    } catch (error) {
      setMessages(prev => [...prev, { type: 'bot', text: 'Error connecting to AI server.' }])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleChat = () => setIsOpen(!isOpen)

  const floatingBtn = (
    <button onClick={toggleChat} className="hover-glow" style={{
      position: 'fixed', bottom: 30, right: 30, width: 64, height: 64,
      borderRadius: '50%', background: 'var(--gradient-primary)', border: 'none',
      color: '#fff', fontSize: '1.8rem', cursor: 'pointer', zIndex: 1000,
      boxShadow: '0 8px 25px rgba(22,163,74,0.4)', transition: '0.3s'
    }}>
      {isOpen ? '✕' : '💬'}
    </button>
  )

  if (!isOpen && isFloating) return floatingBtn

  return (
    <>
      {isFloating && floatingBtn}
      <div style={{
        position: isFloating ? 'fixed' : 'relative',
        bottom: isFloating ? 110 : 0, right: isFloating ? 30 : 0,
        width: isFloating ? 400 : '100%', height: isFloating ? 600 : '100%',
        background: '#fff', borderRadius: 24, display: 'flex', flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)', zIndex: 1000, overflow: 'hidden',
        border: '1px solid var(--border)', animation: 'slideUp 0.3s ease'
      }}>
        {/* Header */}
        <div style={{ padding: '1.25rem', background: 'var(--gradient-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.5rem' }}>🤖</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>KrishiAI Assistant</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Online | Expert Advice</div>
            </div>
          </div>
          {isFloating && <button onClick={toggleChat} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>}
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ alignSelf: m.type === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
              <div style={{
                padding: '0.75rem 1rem', borderRadius: 16, fontSize: '0.9rem', lineHeight: 1.5,
                background: m.type === 'user' ? 'var(--primary)' : '#f3f4f6',
                color: m.type === 'user' ? '#fff' : '#111827',
                borderBottomRightRadius: m.type === 'user' ? 2 : 16,
                borderBottomLeftRadius: m.type === 'user' ? 16 : 2,
              }}>
                {m.text}
              </div>
            </div>
          ))}
          {isLoading && <div style={{ fontStyle: 'italic', fontSize: '0.8rem', color: '#6b7280' }}>KrishiAI is thinking...</div>}
        </div>

        {/* Input */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
          <form onSubmit={e => { e.preventDefault(); handleSend() }} style={{ display: 'flex', gap: 8 }}>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." style={{
              flex: 1, border: '1px solid var(--border)', borderRadius: 20, padding: '0.6rem 1rem', outline: 'none'
            }} />
            <button type="button" onClick={startListening} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>{isListening ? '🛑' : '🎤'}</button>
            <button type="submit" disabled={!input.trim()} style={{ background: 'var(--primary)', border: 'none', color: '#fff', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer' }}>➔</button>
          </form>
        </div>
      </div>
    </>
  )
}
