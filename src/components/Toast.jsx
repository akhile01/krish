export default function Toast({ message, type = 'info' }) {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }
  const colors = {
    success: { bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.4)',   color: '#4ade80' },
    error:   { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.4)',   color: '#f87171' },
    warning: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.4)',  color: '#fcd34d' },
    info:    { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.4)',  color: '#93c5fd' },
  }
  const c = colors[type] || colors.info

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: '12px',
      padding: '0.75rem 1.1rem',
      color: c.color,
      fontSize: '0.875rem',
      fontWeight: 500,
      minWidth: 240,
      maxWidth: 340,
      backdropFilter: 'blur(16px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      animation: 'toastIn 0.3s ease both',
    }}>
      <span style={{ fontSize: '1rem' }}>{icons[type]}</span>
      <span>{message}</span>
    </div>
  )
}
