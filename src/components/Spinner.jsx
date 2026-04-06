export default function Spinner({ size = 24, color = 'var(--primary)' }) {
  return (
    <span style={{
      display: 'inline-block',
      width: size,
      height: size,
      border: `2px solid rgba(255,255,255,0.12)`,
      borderTop: `2px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  )
}
