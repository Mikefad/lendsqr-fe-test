import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { AuthSession, clearSession, createSession, getSession } from '../services/auth'

interface AuthContextValue {
  session: AuthSession | null
  login: (email: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => getSession())

  const value = useMemo<AuthContextValue>(() => ({
    session,
    login(email) {
      setSession(createSession(email))
    },
    logout() {
      clearSession()
      setSession(null)
    },
  }), [session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
