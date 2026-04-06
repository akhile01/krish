import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth'
import { auth } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) { setLoading(false); return }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const signOut = async () => {
    if (auth) await fbSignOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
