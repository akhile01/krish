import { useState, useRef, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'
import { useToast } from '../context/ToastContext'

const NAV_LINKS = [
  { to: '/',         label: '🏠 Dashboard' },
  { to: '/advisory', label: '🌾 Advisory' },
  { to: '/market',   label: '📈 Market' },
  { to: '/image',    label: '🔬 Image AI' },
]

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const AUTH_ENABLED = !!CLERK_KEY   // ✅ FIXED

export default function Navbar() {
  const { user, isLoaded } = AUTH_ENABLED ? useUser() : { user: null, isLoaded: true }
  const { addToast } = useToast()
  const [menuOpen, setMenuOpen] = useState(false)

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
        <div style={{ display: 'flex', gap: '0.4rem' }} className="nav-desktop-links">
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
        
        {/* Live Site Link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }} className="hide-mobile">
          <a href="https://akhile01.github.io/krish/" target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.5rem 1rem', borderRadius: 10,
            fontSize: '0.85rem', fontWeight: 700,
            color: 'var(--primary)', border: '1px solid var(--primary)',
            textDecoration: 'none', transition: 'var(--transition)'
          }} className="hover-glow">
            Live Site ↗
          </a>
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
          {AUTH_ENABLED && isLoaded && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {!user ? (
                <>
                  <SignInButton mode="modal">
                    <button className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                      Sign Up
                    </button>
                  </SignUpButton>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.2 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {user.firstName || user.username}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      Farmer Account
                    </span>
                  </div>
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        userButtonAvatarBox: {
                          width: 40, height: 40, borderRadius: 12, border: '2px solid var(--primary-light)'
                        }
                      }
                    }}
                  />
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

      {/* Responsive styles injected */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </>
  )
}
