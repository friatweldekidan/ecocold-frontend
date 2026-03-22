import { useEffect, useState } from 'react'
import api from '../../services/api'

type Payment = {
  id: number
  booking_id: number
  amount: number
  status: string
}

export function OperatorPayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<Payment[]>('/payments')
        setPayments(res.data)
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Unable to load payments')
      }
    }
    load()
  }, [])

  const total = payments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="page">
      <h1 className="page-title">Payments</h1>
      {error && <div className="error-banner">{error}</div>}

      <section className="card-grid">
        <div className="card">
          <h2>Summary</h2>
          <p className="stat-value">{total.toLocaleString(undefined, {
            style: 'currency',
            currency: 'USD',
          })}</p>
          <p className="muted small">
            Total value of payments recorded in EcoCold.
          </p>
        </div>
        <div className="card">
          <h2>Payment list</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Booking</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.booking_id}</td>
                  <td>{p.amount}</td>
                  <td>{p.status}</td>
                </tr>
              ))}
              {payments.length === 0 && !error && (
                <tr>
                  <td colSpan={4} className="muted">
                    No payments yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

