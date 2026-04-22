import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{
      background: '#fff',
      borderTop: '1px solid var(--border)',
      padding: '4rem 2rem 2rem',
      marginTop: 'auto'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          {/* Brand & Mission */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '1.5rem', marginBottom: '1.25rem' }}>
              <span>🌿</span>
              <span className="gradient-text">KrishiAI</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: 320 }}>
              Empowering farmers with cutting-edge AI for smarter, more sustainable agriculture. Join 15,000+ farmers growing with KrishiAI.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/advisory" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none', transition: 'var(--transition)' }} className="hover-green">AI Advisory</Link>
              <Link to="/market" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none', transition: 'var(--transition)' }} className="hover-green">Market Trends</Link>
              <Link to="/image" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none', transition: 'var(--transition)' }} className="hover-green">Pest Detection</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Resources</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a href="https://akhile01.github.io/krish/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none', transition: 'var(--transition)' }} className="hover-green">Live Demo</a>
              <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none', transition: 'var(--transition)' }} className="hover-green">Farmer Guide</a>
              <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none', transition: 'var(--transition)' }} className="hover-green">Documentation</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            © {currentYear} KrishiAI. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="https://akhile01.github.io/krish/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
              View Live Site ↗
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .hover-green:hover { color: var(--primary) !important; transform: translateX(4px); }
      `}</style>
    </footer>
  )
}
