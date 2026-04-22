import { Link } from 'react-router-dom'
import StatsCard from '../components/StatsCard'
import WeatherCard from '../components/WeatherCard'
import CropSeasonGuide from '../components/CropSeasonGuide'

export default function Dashboard() {
  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="mesh-gradient" style={{
        padding: '8rem 2rem 6rem',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
          width: '100%', height: '100%',
          background: 'radial-gradient(circle at 50% 20%, rgba(34, 197, 94, 0.05) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="badge badge-green float-animation" style={{ marginBottom: '1.5rem', padding: '0.6rem 1.25rem' }}>
            <span style={{ marginRight: '0.4rem' }}>⭐</span> Trusted by 15,000+ Farmers
          </div>
          <h1 style={{
            fontSize: 'max(3rem, 5vw)', fontWeight: 950, color: 'var(--text-primary)',
            letterSpacing: '-0.05em', lineHeight: 1.05, marginBottom: '1.75rem'
          }}>
            The Future of Farming is <span className="gradient-text">Intelligent</span>
          </h1>
          <p style={{
            fontSize: '1.25rem', color: 'var(--text-secondary)',
            maxWidth: 700, margin: '0 auto 3rem', lineHeight: 1.6, fontWeight: 500
          }}>
            Empower your farm with KrishiAI's hyper-local weather alerts, pest diagnosis, and expert AI advising. Grow smarter, faster, and more sustainably.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/advisory" className="btn btn-primary" style={{ height: 64, padding: '0 3rem', fontSize: '1.1rem', fontWeight: 700, boxShadow: '0 10px 30px -10px rgba(34, 197, 94, 0.4)' }}>
              Start AI Consultation 🪴
            </Link>
            <Link to="/image" className="btn btn-outline" style={{ height: 64, padding: '0 2.5rem', fontSize: '1.1rem', fontWeight: 700, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)' }}>
              Diagnose Crop 🩺
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '4rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
          <StatsCard icon="👨‍🌾" value="15000" label="Trusted Farmers" suffix="+" />
          <StatsCard icon="🌿" value="150" label="Crop Varieties" suffix="+" />
          <StatsCard icon="🎯" value="99.2" label="AI Accuracy" suffix="%" />
          <StatsCard icon="⚡" value="2" label="Second Response" suffix="s" />
        </div>
      </section>

      {/* Insights Section */}
      <section style={{ padding: '2rem 2rem 6rem', background: '#f9fafb' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem', alignItems: 'start' }}>
            <div>
              <div className="badge badge-amber" style={{ marginBottom: '1rem' }}>Live Intelligence</div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '1.25rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Your Local Weather Insights
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                KrishiAI monitors your micro-climate 24/7. Get specific alerts for irrigation, fertilization, and pest risks based on real-time data.
              </p>
              <WeatherCard />
              <div style={{ marginTop: '2rem' }}>
                <CropSeasonGuide />
              </div>
            </div>

            <div className="card" style={{ padding: '2.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--text-primary)' }}>Quick Access Hub</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: '💰', title: 'Market Trends', desc: 'Real-time Mandi prices', to: '/market', color: '#eff6ff' },
                  { icon: '🧬', title: 'Pest Detection', desc: 'Instant leaf diagnosis', to: '/image', color: '#f0fdf4' },
                  { icon: '💬', title: 'Expert Advisor', desc: 'Chat with KrishiAI', to: '/advisory', color: '#fff7ed' },
                ].map((item, i) => (
                  <Link key={i} to={item.to} style={{
                    display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem',
                    borderRadius: 20, border: '1px solid var(--border)', textDecoration: 'none',
                    transition: 'var(--transition)', background: 'var(--bg-card)'
                  }} className="hover-glow card-hover-alt">
                    <div style={{ width: 56, height: 56, borderRadius: 14, background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', color: '#000' }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{item.title}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
