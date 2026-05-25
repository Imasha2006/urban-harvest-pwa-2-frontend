import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, if a token exists, fetch the current user
  useEffect(() => {
    const token = localStorage.getItem('uh-token')
    if (!token) { setLoading(false); return }
    api.me()
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem('uh-token'))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const { user, token } = await api.login({ email, password })
    localStorage.setItem('uh-token', token)
    setUser(user)
    return user
  }, [])

  const register = useCallback(async (name, email, password) => {
    const { user, token } = await api.register({ name, email, password })
    localStorage.setItem('uh-token', token)
    setUser(user)
    return user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('uh-token')
    setUser(null)
  }, [])

  const value = { user, loading, login, register, logout, isAdmin: user?.role === 'admin' }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
