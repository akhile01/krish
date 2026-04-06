import { useState, useCallback } from 'react'

export default function ImageUploader() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (selectedFile) => {
    if (!selectedFile) return
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setResult(null)
  }

  const onDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  const analyzeImage = () => {
    setLoading(true)
    // Mock API call
    setTimeout(() => {
      setResult({
        disease: 'Blast Disease (Magnaporthe oryzae)',
        confidence: 94.2,
        treatment: 'Spray Tricyclazole 75% WP @ 0.6g/liter and ensure proper field drainage.'
      })
      setLoading(false)
    }, 2000)
  }

  return (
    <div style={{ width: '100%', maxWidth: 720, margin: '0 auto' }}>
      {!preview ? (
        <label
          onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            height: 280, border: '2px dashed var(--border)', borderRadius: 24,
            cursor: 'pointer', background: isDragging ? 'var(--accent)' : '#fff',
            transition: 'var(--transition)',
            borderColor: isDragging ? 'var(--primary)' : 'var(--border)',
          }}
          className="hover-glow"
        >
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📸</div>
          <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.25rem' }}>Upload Crop Photo</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Drag & drop or click to analyze pests/diseases</div>
          <input type="file" hidden accept="image/*" onChange={e => handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="card fade-in" style={{ padding: '1.5rem', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 1.5fr', gap: '2rem' }}>
            <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height: 320, border: '1px solid var(--border)' }}>
              <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => { setPreview(null); setFile(null); setResult(null) }} style={{
                position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.9)', color: 'var(--text-primary)',
                border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontWeight: 800
              }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {!result ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Ready for Analysis</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Our AI will identify potential diseases and suggest treatments.</p>
                  </div>
                  <button
                    onClick={analyzeImage}
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ width: '100%', height: 56, justifyContent: 'center', fontSize: '1.05rem' }}
                  >
                    {loading ? (
                      <>
                        <span style={{ width: 20, height: 20, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        Analyzing...
                      </>
                    ) : '🔍 Star AI Diagnosis'}
                  </button>
                </div>
              ) : (
                <div style={{ animation: 'fadeIn 0.4s ease both' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <span className="badge badge-green">AI Diagnosis Active</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>{result.confidence}% Confidence</span>
                  </div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.75rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{result.disease}</h3>
                  
                  <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 16, border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Expert Treatment Plan</div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{result.treatment}</p>
                  </div>

                  <button onClick={() => { setPreview(null); setFile(null); setResult(null) }} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                    Upload New Image
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
