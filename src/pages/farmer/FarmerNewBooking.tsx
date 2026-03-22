import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import api from '../../services/api'

type Hub = {
  id: number
  name: string
}

export function FarmerNewBooking() {
  const [hubs, setHubs] = useState<Hub[]>([])
  const [hubId, setHubId] = useState<number | ''>('')
  const [crates, setCrates] = useState(10)
  const [bookingDate, setBookingDate] = useState<string>('')
  const [farmerId, setFarmerId] = useState<number | ''>('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>(
    'idle',
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    setBookingDate(today)
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const hubsRes = await api.get<Hub[]>('/hubs')
        setHubs(hubsRes.data)
      } catch {
        // ignore — hubs list may be restricted
      }
    }
    load()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!hubId) {
      setError('Choose a storage hub.')
      return
    }
    if (!farmerId) {
      setError('Enter your farmer ID (ask your operator if unsure).')
      return
    }

    setStatus('saving')
    setError(null)
    try {
      await api.post('/bookings', {
        farmer_id: farmerId,
        hub_id: hubId,
        crates,
        booking_date: bookingDate,
      })
      setStatus('success')
    } catch (err: any) {
      setStatus('error')
      setError(err?.response?.data?.error || 'Unable to create booking')
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">New booking</h1>
      <p className="muted">
        Reserve crates at a hub. The operator will confirm once your produce
        arrives.
      </p>

      <form className="card form" onSubmit={handleSubmit}>
        <label>
          Storage hub
          <select
            value={hubId}
            onChange={(e) => setHubId(Number(e.target.value) || '')}
            required
          >
            <option value="">Select hub…</option>
            {hubs.map((hub) => (
              <option key={hub.id} value={hub.id}>
                {hub.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Your farmer ID
          <input
            type="number"
            min={1}
            value={farmerId}
            onChange={(e) => setFarmerId(Number(e.target.value) || '')}
            required
          />
          <span className="muted small">
            Ask your hub operator which farmer record to use. This connects your
            booking to the right farm.
          </span>
        </label>

        <label>
          Number of crates
          <input
            type="number"
            min={1}
            value={crates}
            onChange={(e) => setCrates(Number(e.target.value))}
            required
          />
        </label>

        <label>
          Booking date
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            required
          />
        </label>

        {error && <div className="error-banner">{error}</div>}
        {status === 'success' && (
          <div className="success-banner">
            Booking created. You will see it in the operator dashboard.
          </div>
        )}

        <button
          type="submit"
          className="btn primary"
          disabled={status === 'saving'}
        >
          {status === 'saving' ? 'Creating booking…' : 'Create booking'}
        </button>
      </form>
    </div>
  )
}

