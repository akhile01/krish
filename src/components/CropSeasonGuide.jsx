import { useState, useEffect } from 'react'

export default function CropSeasonGuide() {
  const [season, setSeason] = useState('')
  const [crops, setCrops] = useState([])
  const [desc, setDesc] = useState('')
  const [icon, setIcon] = useState('')

  useEffect(() => {
    const month = new Date().getMonth() // 0 = Jan, 11 = Dec

    if (month >= 1 && month <= 4) {
      // Feb to May (Zaid / Summer)
      setSeason('Zaid (Summer)')
      setDesc('Warm months with high sunlight. Focus on drought-resistant and short-duration crops.')
      setCrops(['Maize', 'Watermelon', 'Cucumber', 'Moong Dal'])
      setIcon('☀️')
    } else if (month >= 5 && month <= 8) {
      // June to Sept (Kharif / Monsoon)
      setSeason('Kharif (Monsoon)')
      setDesc('Heavy rainfall period. Ensure good field drainage and watch for water-borne pests.')
      setCrops(['Paddy (Rice)', 'Cotton', 'Soybean', 'Sugarcane'])
      setIcon('🌧️')
    } else {
      // Oct to Jan (Rabi / Winter)
      setSeason('Rabi (Winter)')
      setDesc('Cooler temperatures. Requires frequent but light irrigation. Protect from frost.')
      setCrops(['Wheat', 'Mustard', 'Gram', 'Barley'])
      setIcon('❄️')
    }
  }, [])

  return (
    <div className="card hover-glow" style={{ padding: '2rem', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>Crop Season Guide</h3>
        <div style={{ padding: '0.4rem 1rem', background: 'var(--accent)', color: 'var(--primary-dark)', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Current Season
        </div>
      </div>
      
      <div style={{ padding: '1.5rem', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '2.5rem' }}>{icon}</div>
          <div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{season}</h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{new Date().toLocaleString('default', { month: 'long' })} Guide</div>
          </div>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</p>
      </div>

      <div>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>Recommended Crops to Plant Now</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {crops.map(c => (
            <span key={c} style={{
              padding: '0.4rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--border-green)', 
              borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)'
            }}>{c}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
