import { useState } from 'react'

export default function Advisory() {
  const [formData, setFormData] = useState({ soil: '', season: '', location: '' })
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleRecommend = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setRecommendation({
        crops: ['Paddy (RNR 15048)', 'Cotton (BT Hybrid)', 'Maize (DHM 117)'],
        tips: 'Based on your clayey soil and Kharif season, high-yield Paddy is ideal. Maintain 2-3cm water level consistently.'
      })
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="fade-in">
      <section style={{
        padding: '5rem 2rem 4rem',
        background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="badge badge-green" style={{ marginBottom: '1.25rem' }}>AI Expert Advisor</div>
          <h1 style={{ fontSize: '3rem', fontWeight: 950, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
            Precision Farming <span className="gradient-text">Insights</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 600, margin: '0 auto' }}>
            Get tailored crop recommendations and expert advice powered by real-time data and scientific models.
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '3rem', alignItems: 'start' }}>
          {/* Recommendation Form */}
          <div className="card" style={{ padding: '2.5rem', background: '#fff', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.75rem', color: 'var(--text-primary)' }}>Crop Recommender</h3>
            <form onSubmit={handleRecommend} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Soil Type</label>
                <select className="form-select" value={formData.soil} onChange={e => setFormData({...formData, soil: e.target.value})} required style={{ width: '100%', height: 48, borderRadius: 12, border: '1px solid var(--border)', padding: '0 1rem', background: '#f9fafb' }}>
                  <option value="">Select Soil Condition</option>
                  <option value="black">Black Soil</option>
                  <option value="red">Red Soil</option>
                  <option value="clayey">Clayey Soil</option>
                  <option value="alluvial">Alluvial Soil</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Growing Season</label>
                <select className="form-select" value={formData.season} onChange={e => setFormData({...formData, season: e.target.value})} required style={{ width: '100%', height: 48, borderRadius: 12, border: '1px solid var(--border)', padding: '0 1rem', background: '#f9fafb' }}>
                  <option value="">Select Season</option>
                  <option value="kharif">Kharif (Monsoon)</option>
                  <option value="rabi">Rabi (Winter)</option>
                  <option value="zaid">Zaid (Summer)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Farm Location</label>
                <input className="form-input" placeholder="e.g. Warangal, Telangana" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required style={{ width: '100%', height: 48, borderRadius: 12, border: '1px solid var(--border)', padding: '0 1rem', background: '#f9fafb' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: 52, borderRadius: 12, fontWeight: 700 }} disabled={loading}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Analyzing Data...
                  </span>
                ) : '🎯 Get AI Recommendation'}
              </button>
            </form>

            {recommendation && (
              <div className="slide-up" style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-surface)', borderRadius: 16, border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Recommendations</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1.25rem' }}>
                  {recommendation.crops.map(c => <span key={c} className="badge badge-green" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>{c}</span>)}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 500 }}>
                  {recommendation.tips}
                </p>
              </div>
            )}
          </div>

          {/* Assistant Preview / Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             <div className="card" style={{ padding: '3rem', textAlign: 'center', background: '#fff', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🤖</div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Instant Agriculture Support</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Have specific questions about pests, weather, or soil health? Our AI assistant is available 24/7 in the bottom right corner of your screen.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                  {['Best rice for black soil', 'Tomato blight signs', 'NPK for chilli'].map(q => (
                    <span key={q} style={{ padding: '0.75rem 1.25rem', background: '#f9fafb', border: '1px solid var(--border)', borderRadius: 14, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{q}</span>
                  ))}
                </div>
             </div>

             <div className="card" style={{ padding: '1.5rem', background: 'var(--gradient-primary)', color: '#fff', border: 'none', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ fontSize: '2.5rem' }}>💡</div>
                <div>
                  <h4 style={{ fontWeight: 800, marginBottom: '0.25rem', fontSize: '1.1rem' }}>Expert Farming Tip</h4>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.4, opacity: 0.9 }}>
                    Rotating crops like legumes with cereals helps naturally maintain soil nitrogen levels and reduces pest cycles.
                  </p>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  )
}
