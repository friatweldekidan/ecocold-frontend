import { useEffect, useState } from 'react'
import api from '../../services/api'

type Booking = {
  id: number
  farmer_id: number
  hub_id: number
  crates: number
  status: string
  booking_date: string
}

export function OperatorBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<Booking[]>('/bookings')
        setBookings(res.data)
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Unable to load bookings')
      }
    }
    load()
  }, [])

  return (
    <div className="page">
      <h1 className="page-title">Bookings</h1>
      {error && <div className="error-banner">{error}</div>}
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Farmer</th>
              <th>Hub</th>
              <th>Crates</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.farmer_id}</td>
                <td>{b.hub_id}</td>
                <td>{b.crates}</td>
                <td>{b.status}</td>
                <td>{new Date(b.booking_date).toLocaleDateString()}</td>
              </tr>
            ))}
            {bookings.length === 0 && !error && (
              <tr>
                <td colSpan={6} className="muted">
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

