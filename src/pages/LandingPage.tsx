import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="landing">
      <header className="landing-header">
        <div className="logo-large">EcoCold</div>
        <nav>
          <Link to="/login" className="btn ghost">
            Log in
          </Link>
          <Link to="/register" className="btn primary">
            Get started
          </Link>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="hero-text">
          <h1>Smart cold storage for farmers and operators</h1>
          <p>
            Book storage crates, monitor capacity, and track payments in one
            simple dashboard.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn primary">
              I am a farmer / trader
            </Link>
            <Link to="/register" className="btn secondary">
              I manage a storage hub
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <h2>Live bookings overview</h2>
          <p className="muted">
            Once you sign in, you&apos;ll see your real-time bookings, capacity
            and revenue here.
          </p>
        </div>
      </section>
    </div>
  )
}

