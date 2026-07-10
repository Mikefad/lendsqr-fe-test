export const SESSION_STORAGE_KEY = 'lendsqr-session'

export interface AuthSession {
  email: string
  displayName: string
  createdAt: string
}

export function getSession(): AuthSession | null {
  const storedSession = localStorage.getItem(SESSION_STORAGE_KEY)
  if (!storedSession) return null

  try {
    return JSON.parse(storedSession) as AuthSession
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    return null
  }
}

export function createSession(email: string): AuthSession {
  const session: AuthSession = {
    email,
    displayName: email.split('@')[0] || 'Adedeji',
    createdAt: new Date().toISOString(),
  }
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
  return session
}

export function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY)
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
