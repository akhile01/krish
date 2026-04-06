import { useState, useEffect } from 'react'

const MOCK_WEATHER = {
  city: 'Hyderabad, Telangana',
  temp: 32,
  feels: 35,
  condition: 'Partly Cloudy',
  icon: '⛅',
  humidity: 68,
  wind: 12,
  rainChance: 40,
  uv: 7,
  uvLabel: 'High',
}

export default function WeatherCard() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // API-ready: replace with fetch('/api/weather')
    const timer = setTimeout(() => {
      setWeather(MOCK_WEATHER)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        {[80, 120, 60, 90].map((w, i) => (
          <div key={i} style={{ height: 16, width: `${w}%`, background: 'rgba(255,255,255,0.06)', borderRadius: 6, animation: 'pulse 1.5s infinite' }} />
        ))}
      </div>
    </div>
  )

  return (
    <div className="card fade-in" style={{ padding: '2rem', overflow: 'hidden', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Weather</div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>📍 {weather.city}</div>
        </div>
        <span style={{ fontSize: '3rem', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.05))' }}>{weather.icon}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>{weather.temp}</span>
        <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-secondary)' }}>°C</span>
      </div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 600, marginBottom: '2rem' }}>
        {weather.condition} · Feels like {weather.feels}°C
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {[
          { label: 'Humidity',    value: `${weather.humidity}%`, icon: '💧' },
          { label: 'Wind Speed',  value: `${weather.wind} km/h`, icon: '🌬️' },
          { label: 'Rain Chance', value: `${weather.rainChance}%`, icon: '🌧️' },
          { label: 'UV Index',    value: `${weather.uv} ${weather.uvLabel}`, icon: '☀️' },
        ].map(({ label, value, icon }) => (
          <div key={label} style={{ background: 'var(--bg-surface)', borderRadius: 16, padding: '1rem', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>{label}</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ opacity: 0.8 }}>{icon}</span> {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
