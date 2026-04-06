import { useEffect, useRef } from 'react'

export default function StatsCard({ icon, value, label, suffix = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let start = 0
    const target = parseFloat(value)
    const duration = 2000
    const startTime = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(target * eased)
      el.textContent = current + suffix
      if (progress < 1) requestAnimationFrame(tick)
      else el.textContent = target + suffix
    }

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { requestAnimationFrame(tick); obs.disconnect() }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [value, suffix])

  return (
    <div className="card" style={{ padding: '2rem', textAlign: 'center', flex: 1, minWidth: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{icon}</div>
      <div style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
        <span ref={ref}>0{suffix}</span>
      </div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>{label}</div>
    </div>
  )
}
