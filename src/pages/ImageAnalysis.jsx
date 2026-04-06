import ImageUploader from '../components/ImageUploader'

export default function ImageAnalysis() {
  return (
    <div className="fade-in">
      <section style={{
        padding: '5rem 2rem 4rem',
        background: 'linear-gradient(180deg, #f5f3ff 0%, #ffffff 100%)',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="badge badge-purple" style={{ marginBottom: '1.25rem' }}>AI Computer Vision</div>
          <h1 style={{ fontSize: '3rem', fontWeight: 950, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
            Instant Pest <span style={{ color: '#7c3aed' }}>Detection</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 600, margin: '0 auto' }}>
            Snap a photo of your crop leaf and get a surgical-grade diagnosis in seconds. Powered by deep learning trained on 100k+ agriculture images.
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <ImageUploader />

        <div style={{ maxWidth: 1000, margin: '5rem auto 0', padding: '3.5rem', background: '#f9fafb', borderRadius: 32, border: '1px solid var(--border)' }}>
          <h3 style={{ textAlign: 'center', fontSize: '1.75rem', fontWeight: 900, marginBottom: '3rem', letterSpacing: '-0.02em' }}>How it works</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem' }}>
            {[
              { step: '01', title: 'Upload Photo', desc: 'Take a clear, close-up photo of the affected leaf area in good lighting.' },
              { step: '02', title: 'AI Analysis', desc: 'Our neural network identifies symptoms and matches them against known pathogens.' },
              { step: '03', title: 'Expert Advice', desc: 'Receive instant diagnosis results and detailed chemical or organic treatment plans.' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ fontSize: '3rem', fontWeight: 950, color: 'var(--primary)', opacity: 0.15, position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>{item.step}</div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 500 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
