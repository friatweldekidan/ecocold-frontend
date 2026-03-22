import { useEffect, useState } from 'react'
import api from '../../services/api'
import { useAuth } from '../../auth/AuthContext'

type Hub = {
  id: number
  name: string
  location: string
  capacity: number
}

export function FarmerDashboard() {
  const { user } = useAuth()
  const [hubs, setHubs] = useState<Hub[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<Hub[]>('/hubs')
        setHubs(res.data)
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Unable to load hubs')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="page">
      <h1 className="page-title">Welcome, {user?.name}</h1>
      <p className="muted">
        Book crates at the nearest EcoCold hub and keep your produce fresh for
        market.
      </p>

      <section className="card-grid">
        <div className="card">
          <h2>Available hubs</h2>
          {loading && <p className="muted">Loading hubs…</p>}
          {error && <p className="error-text">{error}</p>}
          {!loading && !error && (
            <ul className="list">
              {hubs.map((hub) => (
                <li key={hub.id}>
                  <div className="list-title">{hub.name}</div>
                  <div className="list-subtitle">
                    {hub.location} • Capacity: {hub.capacity} crates
                  </div>
                </li>
              ))}
              {hubs.length === 0 && (
                <li className="muted">No hubs available yet.</li>
              )}
            </ul>
          )}
        </div>

        <div className="card">
          <h2>Next steps</h2>
          <ol className="steps">
            <li>Choose the hub closest to your farm.</li>
            <li>Create a booking for the number of crates you need.</li>
            <li>Deliver your produce and confirm payment with the operator.</li>
          </ol>
        </div>
      </section>
    </div>
  )
}

