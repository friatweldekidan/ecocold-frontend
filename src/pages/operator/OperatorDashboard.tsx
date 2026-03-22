import { useEffect, useState } from 'react'
import api from '../../services/api'

type CountResponse = { total: number }

export function OperatorDashboard() {
  const [farmerCount, setFarmerCount] = useState<number | null>(null)
  const [hubCount, setHubCount] = useState<number | null>(null)
  const [bookingCount, setBookingCount] = useState<number | null>(null)
  const [paymentCount, setPaymentCount] = useState<number | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [farmers, hubs, bookings, payments] = await Promise.all([
          api.get('/farmers'),
          api.get('/hubs'),
          api.get('/bookings'),
          api.get('/payments'),
        ])
        setFarmerCount((farmers.data as CountResponse[] | any[]).length)
        setHubCount((hubs.data as CountResponse[] | any[]).length)
        setBookingCount((bookings.data as CountResponse[] | any[]).length)
        setPaymentCount((payments.data as CountResponse[] | any[]).length)
      } catch {
        // counts will stay null
      }
    }
    load()
  }, [])

  return (
    <div className="page">
      <h1 className="page-title">Operator overview</h1>
      <p className="muted">
        Monitor capacity, bookings, and payments across all EcoCold hubs you
        manage.
      </p>

      <section className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Farmers</div>
          <div className="stat-value">
            {farmerCount !== null ? farmerCount : '–'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Storage hubs</div>
          <div className="stat-value">{hubCount !== null ? hubCount : '–'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Bookings</div>
          <div className="stat-value">
            {bookingCount !== null ? bookingCount : '–'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Payments</div>
          <div className="stat-value">
            {paymentCount !== null ? paymentCount : '–'}
          </div>
        </div>
      </section>
    </div>
  )
}

