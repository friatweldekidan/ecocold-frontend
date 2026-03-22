import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'farmer' | 'hub_owner'>('farmer')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register({ name, email, password, role })
      navigate(role === 'hub_owner' ? '/operator' : '/farmer')
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Unable to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create your EcoCold account</h1>
        <p className="muted">
          Choose your role so we can tailor the dashboard to you.
        </p>

        <form onSubmit={handleSubmit} className="form">
          <label>
            Full name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <fieldset className="role-fieldset">
            <legend>Role</legend>
            <label className="radio-pill">
              <input
                type="radio"
                name="role"
                value="farmer"
                checked={role === 'farmer'}
                onChange={() => setRole('farmer')}
              />
              <span>Farmer</span>
            </label>
            <label className="radio-pill">
              <input
                type="radio"
                name="role"
                value="hub_owner"
                checked={role === 'hub_owner'}
                onChange={() => setRole('hub_owner')}
              />
              <span>Operator / Hub owner</span>
            </label>
          </fieldset>

          {error && <div className="error-banner">{error}</div>}

          <button className="btn primary full" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="muted small">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  )
}

