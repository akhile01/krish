import { Link } from 'react-router-dom'
import StatsCard from '../components/StatsCard'
import WeatherCard from '../components/WeatherCard'

export default function Dashboard() {
  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section style={{
        padding: '6rem 2rem 5rem',
        background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="badge badge-green" style={{ marginBottom: '1.5rem' }}>✨ AI-Powered Agriculture</div>
          <h1 style={{
            fontSize: 'max(2.5rem, 4vw)', fontWeight: 950, color: 'var(--text-primary)',
            letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1.5rem'
          }}>
            Modernizing Agriculture with <span className="gradient-text">KrishiAI</span>
          </h1>
          <p style={{
            fontSize: '1.15rem', color: 'var(--text-secondary)',
            maxWidth: 650, margin: '0 auto 2.5rem', lineHeight: 1.6, fontWeight: 500
          }}>
            Access real-time crop advice, hyper-local weather insights, and instant pest detection to maximize your yield and sustainability.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/advisory" className="btn btn-primary" style={{ height: 56, padding: '0 2.5rem', fontSize: '1rem', fontWeight: 700 }}>
              Get AI Advice 🚀
            </Link>
            <Link to="/image" className="btn btn-outline" style={{ height: 56, padding: '0 2rem', fontSize: '1rem', fontWeight: 700 }}>
              Analyze Crop 📸
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
            </div>

            <div className="card" style={{ padding: '2.5rem', background: '#fff', border: '1px solid var(--border)' }}>
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
                    transition: 'var(--transition)', background: '#fff'
                  }} className="hover-glow card-hover-alt">
                    <div style={{ width: 56, height: 56, borderRadius: 14, background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>
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
