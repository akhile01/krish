import { SignUp } from "@clerk/clerk-react"

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const AUTH_ENABLED = CLERK_KEY && CLERK_KEY !== 'pk_test_...'

export default function SignUpPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 72px)',
      background: 'var(--gradient-bg)',
      padding: '2rem',
      textAlign: 'center'
    }}>
      {AUTH_ENABLED ? (
        <SignUp 
          routing="path" 
          path="/sign-up" 
          signInUrl="/sign-in"
          appearance={{
            elements: {
              formButtonPrimary: 'clerk-btn-primary',
              card: 'clerk-card'
            }
          }}
        />
      ) : (
        <div className="card" style={{ maxWidth: 400, padding: '2.5rem' }}>
          <span style={{ fontSize: '3rem' }}>🚧</span>
          <h2 style={{ marginTop: '1rem', fontWeight: 800 }}>Authentication Disabled</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem' }}>
            A valid Clerk Publishable Key was not found in <code>.env.local</code>. 
            Authentication features are currently disabled.
          </p>
          <a href="/" className="btn btn-primary" style={{ width: '100%' }}>Back to Dashboard</a>
        </div>
      )}
    </div>
  )
}
