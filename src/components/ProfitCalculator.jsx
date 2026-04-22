import { useState } from 'react'
import { useToast } from '../context/ToastContext'

export default function ProfitCalculator() {
  const { addToast } = useToast()
  const [crop, setCrop] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [result, setResult] = useState(null)

  const handleCalculate = (e) => {
    e.preventDefault()
    if (!crop || !quantity || !price) {
      addToast('Please fill all fields to calculate profit', 'error')
      return
    }

    const qtyNum = parseFloat(quantity)
    const priceNum = parseFloat(price)

    if (qtyNum <= 0 || priceNum <= 0) {
      addToast('Quantity and Market Price must be greater than zero.', 'error')
      return
    }

    const revenue = qtyNum * priceNum
    // Estimate profit margin generically at 35%
    const profit = revenue * 0.35

    setResult({ revenue, profit })
    addToast('Calculation completed! ✅', 'success')
  }

  return (
    <div className="card" style={{ padding: '2rem', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
        <div style={{ width: 44, height: 44, background: 'var(--accent)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--primary)' }}>🧮</div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Profit Calculator</h3>
      </div>
      
      <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Crop Name</label>
          <input type="text" className="form-input" placeholder="e.g. Cotton" value={crop} onChange={e => setCrop(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Quantity (Quintals/Tons) </label>
          <input type="number" className="form-input" placeholder="e.g. 100" value={quantity} onChange={e => setQuantity(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Market Price per Unit (₹)</label>
          <input type="number" className="form-input" placeholder="e.g. 7200" value={price} onChange={e => setPrice(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: 48, marginTop: '0.5rem' }}>
          Calculate Profit
        </button>
      </form>

      {result && (
        <div className="slide-up" style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border-green)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Est. Revenue</span>
            <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>₹{result.revenue.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Est. Profit (35% Margin)</span>
            <span style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '1.1rem' }}>₹{result.profit.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}
