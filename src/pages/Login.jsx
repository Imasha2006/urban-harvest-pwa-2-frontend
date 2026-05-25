import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      const user = await login(email, password)
      navigate(user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="section-container">
      <div className="max-w-md mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-2">Admin Login</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in to manage content.</p>
        </header>

        {error && <div role="alert" className="card !bg-red-50 dark:!bg-red-900/20 border-red-300 mb-6 text-red-700 dark:text-red-300">{error}</div>}

        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="input-field" required autoComplete="email" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="input-field" required autoComplete="current-password" />
          </div>
          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Demo admin: <code>admin@urbanharvest.local</code> / <code>admin123</code>
          </p>
        </form>
      </div>
    </section>
  )
}
