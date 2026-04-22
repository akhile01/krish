import { useState } from 'react'
import WeatherCard from '../components/WeatherCard'
import ProfitCalculator from '../components/ProfitCalculator'

const MARKET_DATA = [
  { crop: 'Rice (BPT)', mandi: 'Warangal', price: 2050, change: '+12', status: 'up' },
  { crop: 'Rice (Sona)', mandi: 'Nizamabad', price: 2180, change: '+45', status: 'up' },
  { crop: 'Cotton', mandi: 'Adilabad', price: 7200, change: '-150', status: 'down' },
  { crop: 'Maize', mandi: 'Karimnagar', price: 1850, change: '+5', status: 'up' },
  { crop: 'Turmeric', mandi: 'Nizamabad', price: 12500, change: '+400', status: 'up' },
  { crop: 'Chilli', mandi: 'Khammam', price: 18000, change: '-200', status: 'down' },
]

export default function Market() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMarketData = MARKET_DATA.filter(row => 
    row.crop.toLowerCase().includes(searchQuery.toLowerCase()) || 
    row.mandi.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="fade-in">
      {/* Header section */}
      <section style={{
        padding: '5rem 2rem 4rem',
        background: 'linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="badge badge-amber" style={{ marginBottom: '1.25rem' }}>Live Mandi Prices</div>
          <h1 style={{ fontSize: '3rem', fontWeight: 950, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
            Market <span style={{ color: '#d97706' }}>Intelligence</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 600, margin: '0 auto' }}>
            Track real-time commodity prices across regional markets and optimize your sales strategy with AI-driven trends.
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 400px) 1fr', gap: '3rem', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <WeatherCard />
            <ProfitCalculator />
            <div className="card" style={{ padding: '2rem', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
                <div style={{ width: 44, height: 44, background: '#fef3c7', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#000' }}>💡</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Market Insight</h3>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Rice prices are surging in Nizamabad due to high demand from neighboring states. Consider selling your BPT variety this week for maximum profit.
              </p>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Live Mandi Table</h3>
                <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>Updated 5m ago</span>
              </div>
              <input
                type="text"
                placeholder="Search crop or mandi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  width: '200px'
                }}
              />
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Commodity</th>
                    <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Market</th>
                    <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Price (₹)</th>
                    <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMarketData.map((row, i) => (
                    <tr key={i} style={{ borderBottom: i === filteredMarketData.length - 1 ? 'none' : '1px solid var(--border)', transition: 'var(--transition)' }} className="hover-bg-muted">
                      <td style={{ padding: '1.25rem 2rem' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>{row.crop}</div>
                      </td>
                      <td style={{ padding: '1.25rem 2rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{row.mandi}</td>
                      <td style={{ padding: '1.25rem 2rem', fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>₹{row.price.toLocaleString()}</td>
                      <td style={{ padding: '1.25rem 2rem' }}>
                        <span style={{ color: row.status === 'up' ? '#16a34a' : '#dc2626', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                          {row.status === 'up' ? '▲' : '▼'} {row.change}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredMarketData.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', textAlign: 'center', background: 'var(--bg-surface)' }}>
               <button className="btn btn-ghost" style={{ fontSize: '0.9rem', width: '100%' }}>View Full Market Report →</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
