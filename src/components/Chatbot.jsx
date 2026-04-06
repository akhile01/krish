import { useState, useRef, useEffect } from 'react'
import { auth, db } from '../firebase'
import { collection, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'

const BOT_RESPONSES = {
  'Suggest best paddy varieties': '🌾 For Telangana, top-performing paddy varieties include: **RNR-15048 (Telangana Sona)**, **JGL-11470 (Bathukamma)**, and **MTU-1010**. Would you like fertilizer recommendations for these?',
  'Show today\'s weather forecast': '🌤️ **Today\'s Forecast — Hyderabad**\n🌡️ High: 34°C · Low: 24°C\n🌧️ Rainfall: 40% chance in evening\n💨 Wind: 12 km/h NE\n💡 Advisory: Avoid spraying pesticides today due to expected rain.',
  'How to detect pests in my crop?': '🐛 To detect pests: Take a clear photo of the leaf and upload it in the **Image AI** section. Our AI will identify the issue in seconds!',
  'What are today\'s market prices for rice?': '📈 **Rice Market Prices (Today)**\n| Mandi | Variety | Price (₹/qtl) |\n|---|---|---|\n| Nizamabad | Sona | ₹2,180 |\n| Warangal | BPT | ₹2,050 |\n| Karimnagar | HMT | ₹2,320 |',
}

const DEFAULT_RESPONSES = [
  "🌿 That's a great question! I'm still learning, but I can help with crop advice, weather, and market prices.",
  "👨‍🌾 Thanks for asking! Try asking about 'best crop for black soil' or 'today's tomato price'.",
  "📚 I have info on 120+ crop varieties. What specific detail do you need?",
]

export default function Chatbot({ isFloating = true }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Namaste! 🙏 I'm your KrishiAI assistant. How can I help you today?" }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!user) return
    const loadChat = async () => {
      try {
        const docRef = doc(db, 'chats', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) setMessages(docSnap.data().messages)
      } catch (e) { console.warn('Load chat failed', e) }
    }
    loadChat()
  }, [user])

  useEffect(() => {
    if (!user || messages.length <= 1) return
    const saveChat = async () => {
      try {
        await setDoc(doc(db, 'chats', user.uid), {
          uid: user.uid,
          messages,
          updatedAt: serverTimestamp()
        })
      } catch (e) { console.warn('Save chat failed', e) }
    }
    const timeout = setTimeout(saveChat, 1000)
    return () => clearTimeout(timeout)
  }, [messages, user])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = (text = input) => {
    if (!text.trim()) return
    const userMsg = { type: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const botText = BOT_RESPONSES[text] || DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)]
      setMessages(prev => [...prev, { type: 'bot', text: botText }])
      setIsTyping(false)
    }, 1000)
  }

  const quickReplies = Object.keys(BOT_RESPONSES)

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 16 }}>
      {/* Chat Window */}
      {isOpen && (
        <div className="card" style={{
          width: 380, height: 520, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)', border: '1px solid var(--border)',
          background: '#ffffff', borderRadius: 24, animation: 'fadeIn 0.3s ease both',
        }}>
          {/* Header */}
          <div style={{ background: 'var(--gradient-primary)', padding: '1.25rem', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🌿</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>KrishiAI Assistant</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, background: '#4ade80', borderRadius: '50%' }} /> Online
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.type === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%', padding: '0.85rem 1.1rem', borderRadius: 18,
                fontSize: '0.92rem', lineHeight: 1.5,
                background: m.type === 'user' ? 'var(--primary)' : 'var(--bg-surface)',
                color: m.type === 'user' ? '#fff' : 'var(--text-primary)',
                border: m.type === 'user' ? 'none' : '1px solid var(--border)',
                borderBottomRightRadius: m.type === 'user' ? 4 : 18,
                borderBottomLeftRadius: m.type === 'user' ? 18 : 4,
                boxShadow: m.type === 'user' ? '0 4px 12px rgba(34,197,94,0.2)' : 'none',
              }}>
                {m.text}
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', padding: '0.85rem 1.1rem', borderRadius: 18, background: 'var(--bg-surface)', border: '1px solid var(--border)', display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(i => <span key={i} style={{ width: 6, height: 6, background: 'var(--text-muted)', borderRadius: '50%', animation: `blink 1.4s infinite ${i * 0.2}s` }} />)}
              </div>
            )}
          </div>

          {/* Quick Replies */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 1.25rem 1rem', scrollbarWidth: 'none' }}>
            {quickReplies.map(reply => (
              <button key={reply} onClick={() => handleSend(reply)} style={{
                whiteSpace: 'nowrap', padding: '0.5rem 0.9rem', borderRadius: 20, fontSize: '0.75rem',
                background: '#fff', border: '1px solid var(--primary)', color: 'var(--primary)',
                fontWeight: 700, cursor: 'pointer', transition: 'var(--transition)'
              }} className="hover-glow">
                {reply}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend() }} style={{ padding: '1rem 1.25rem 1.25rem', borderTop: '1px solid var(--border)', background: '#fff', display: 'flex', gap: 10 }}>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask anything about farming..." style={{
              flex: 1, border: '1px solid var(--border)', borderRadius: 14, padding: '0.8rem 1.1rem', fontSize: '0.95rem', background: '#f9fafb', outline: 'none', transition: 'var(--transition)',
            }} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            <button type="submit" className="btn-primary" style={{ width: 48, height: 48, borderRadius: 14, border: 'none', background: 'var(--gradient-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      )}

      {/* Trigger */}
      <button onClick={() => setIsOpen(!isOpen)} style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'var(--gradient-primary)', color: '#fff',
        border: 'none', cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
        boxShadow: '0 10px 20px rgba(34, 197, 94, 0.35)',
        transition: 'var(--transition)',
      }} className="hover-glow">
        {isOpen ? '✕' : '🌿'}
      </button>
    </div>
  )
}
