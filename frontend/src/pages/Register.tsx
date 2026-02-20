import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { API_URL } from '../config'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    uid: '',
    uname: '',
    password: '',
    email: '',
    phone: '',
    role: 'Customer',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || `Registration failed (${res.status})`)
        setLoading(false)
        return
      }
      navigate('/login')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Network error. Is the backend running on port 3001?'
      setError(msg)
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="brand-logo" style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
        KOD<span style={{ color: 'var(--text-main)' }}>BANKING</span>
      </div>
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="number"
          placeholder="UID"
          value={form.uid}
          onChange={(e) => setForm({ ...form, uid: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={form.uname}
          onChange={(e) => setForm({ ...form, uname: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          required
        >
          <option value="Customer">Customer</option>
        </select>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  )
}
