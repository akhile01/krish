import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const NAV_LINKS = [
  { to: '/',         label: '🏠 Dashboard' },
  { to: '/advisory', label: '🌾 Advisory' },
  { to: '/market',   label: '📈 Market' },
  { to: '/image',    label: '🔬 Image AI' },
]

export default function Navbar() {
  const { user, signOut }      = useAuth()
  const { addToast }           = useToast()
  const [showModal, setShowModal]   = useState(false)
  const [mode, setMode]             = useState('login') // 'login' | 'signup'
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [name, setName]             = useState('')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const [dropOpen, setDropOpen]     = useState(false)
  const dropRef                     = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const openModal = (m = 'login') => { setMode(m); setError(''); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEmail(''); setPassword(''); setName(''); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!auth) { setError('Firebase not configured. Add credentials to .env.local'); return }
    setLoading(true); setError('')
    const errors = {
      'auth/email-already-in-use': 'Email already registered.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/weak-password': 'Password must be 6+ characters.',
      'auth/user-not-found': 'No account found.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-credential': 'Invalid credentials.',
      'auth/too-many-requests': 'Too many attempts. Try later.',
    }
    try {
      if (mode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(cred.user, { displayName: name || email.split('@')[0] })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      addToast('Signed in successfully! 🌿', 'success')
      closeModal()
    } catch (err) {
      setError(errors[err.code] || err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    if (!auth) { setError('Firebase not configured.'); return }
    setError('')
    try {
      await signInWithPopup(auth, googleProvider)
      addToast('Signed in with Google! 🌿', 'success')
      closeModal()
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') setError(err.message)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setDropOpen(false)
    addToast('Signed out successfully.', 'info')
  }

  const avatarUrl = user?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email?.[0] || 'U')}&background=16a34a&color=fff&size=60&rounded=true&bold=true`

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 72,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        padding: '0 2rem',
        gap: '2rem',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '1.25rem' }}>
          <span style={{ fontSize: '1.8rem' }}>🌿</span>
          <span style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>KrishiAI</span>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', gap: '0.4rem', flex: 1 }} className="nav-desktop-links">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
              padding: '0.6rem 1.1rem',
              borderRadius: 10,
              fontSize: '0.93rem',
              fontWeight: 600,
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              background: isActive ? 'var(--accent)' : 'transparent',
              transition: 'var(--transition)',
            })}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
          {!user ? (
            <button className="btn btn-primary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }} onClick={() => openModal('login')}>
              Sign In
            </button>
          ) : (
            <div ref={dropRef} style={{ position: 'relative' }}>
              <button onClick={() => setDropOpen(o => !o)} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '0.35rem 0.8rem 0.35rem 0.4rem',
                cursor: 'pointer', color: 'var(--text-primary)',
              }}>
                <img src={avatarUrl} alt="avatar" style={{ width: 28, height: 28, borderRadius: '50%' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.displayName || user.email?.split('@')[0]}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>▾</span>
              </button>
              {dropOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 12px)',
                  background: '#ffffff', border: '1px solid var(--border)',
                  borderRadius: 12, padding: '0.5rem', minWidth: 220,
                  boxShadow: 'var(--shadow-lg)', zIndex: 100,
                  animation: 'fadeIn 0.2s ease both',
                }}>
                  <div style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)', marginBottom: '0.3rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{user.displayName}</div>
                    {user.email}
                  </div>
                  <button onClick={handleSignOut} style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '0.7rem 1rem', borderRadius: 8, fontSize: '0.875rem',
                    color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer',
                    fontWeight: 500,
                  }}>
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Hamburger (mobile) */}
          <button onClick={() => setMenuOpen(o => !o)} className="hamburger-btn" style={{
            display: 'none', flexDirection: 'column', gap: 4, padding: '0.4rem',
            background: 'none', border: 'none',
          }}>
            <span style={{ width: 20, height: 2, background: 'var(--text-primary)', borderRadius: 2, display: 'block', transition: 'var(--transition)', transform: menuOpen ? 'rotate(45deg) translate(4px,4px)' : 'none' }} />
            <span style={{ width: 20, height: 2, background: 'var(--text-primary)', borderRadius: 2, display: 'block', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ width: 20, height: 2, background: 'var(--text-primary)', borderRadius: 2, display: 'block', transition: 'var(--transition)', transform: menuOpen ? 'rotate(-45deg) translate(4px,-4px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 72, left: 0, right: 0, zIndex: 999,
          background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          padding: '1.5rem',
          display: 'flex', flexDirection: 'column', gap: '0.5rem',
          boxShadow: 'var(--shadow-md)',
        }}>
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setMenuOpen(false)} style={({ isActive }) => ({
              padding: '1rem', borderRadius: 10, fontSize: '1rem', fontWeight: 600,
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              background: isActive ? 'var(--accent)' : 'transparent',
            })}>
              {label}
            </NavLink>
          ))}
        </div>
      )}

      {/* Auth Modal */}
      {showModal && (
        <div onClick={closeModal} style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#ffffff', border: '1px solid var(--border)',
            borderRadius: 24, padding: '2.5rem', width: '100%', maxWidth: 440,
            boxShadow: 'var(--shadow-lg)',
            animation: 'fadeIn 0.3s ease both',
            position: 'relative',
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🌿</div>
              <h2 style={{ fontWeight: 800, fontSize: '1.75rem', color: 'var(--text-primary)' }}>Welcome to KrishiAI</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
                Sign in to access personalized AI farming advice
              </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', background: 'var(--bg-surface)', borderRadius: 12, padding: 6, marginBottom: '1.5rem' }}>
              {['login', 'signup'].map(m => (
                <button key={m} onClick={() => { setMode(m); setError('') }} style={{
                  flex: 1, padding: '0.6rem', borderRadius: 8, fontSize: '0.9rem', fontWeight: 700,
                  background: mode === m ? '#fff' : 'transparent',
                  color: mode === m ? 'var(--primary)' : 'var(--text-secondary)',
                  border: 'none', cursor: 'pointer', transition: 'var(--transition)',
                  boxShadow: mode === m ? 'var(--shadow-sm)' : 'none',
                }}>
                  {m === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {mode === 'signup' && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" type="text" placeholder="e.g. Ramesh Kumar" value={name} onChange={e => setName(e.target.value)} />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="farmer@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              </div>

              {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', background: '#fef2f2', padding: '0.75rem 1rem', borderRadius: 10, border: '1px solid #fee2e2', fontWeight: 500 }}>{error}</div>}

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', height: 50 }}>
                {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
              <div style={{ height: 1, flex: 1, background: 'var(--border)' }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>OR</span>
              <div style={{ height: 1, flex: 1, background: 'var(--border)' }} />
            </div>

            <button onClick={handleGoogle} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
              height: 50, borderRadius: 12, fontSize: '0.95rem', fontWeight: 700,
              background: '#fff', border: '1px solid var(--border)',
              color: 'var(--text-primary)', cursor: 'pointer', transition: 'var(--transition)',
            }} className="hover-glow">
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>

            <button onClick={closeModal} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'var(--bg-surface)', border: 'none', color: 'var(--text-muted)', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
        </div>
      )}

      {/* Responsive styles injected */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
