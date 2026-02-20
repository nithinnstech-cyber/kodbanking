import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as confetti from 'canvas-confetti'
import { API_URL } from '../config'

export default function Dashboard() {
  const navigate = useNavigate()
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const checkBalance = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_URL}/api/balance`, {
        credentials: 'include',
      })

      if (res.status === 401) {
        navigate('/login')
        return
      }

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to fetch balance')
        return
      }

      setBalance(data.balance)

      // Party popper animation
      const duration = 3000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        })
        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    } catch {
      setError('Failed to fetch balance')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <h1>Dashboard</h1>
        <button onClick={checkBalance} disabled={loading} className="check-balance-btn">
          {loading ? 'Fetching Details...' : 'Secure Check Balance'}
        </button>
        {error && <p className="error" style={{ marginTop: '1rem' }}>{error}</p>}
        {balance !== null && (
          <div className="balance-display">
            <span className="balance-label">Available Balance</span>
            <p className="balance-message">₹{balance.toLocaleString()}</p>
          </div>
        )}
        <button onClick={() => navigate('/login')} className="logout-btn">
          Sign Out
        </button>
      </div>
    </div>
  )
}
