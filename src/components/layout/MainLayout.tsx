import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

const navClasses = ({ isActive }: { isActive: boolean }) =>
  'nav-link' + (isActive ? ' nav-link-active' : '')

export function MainLayout({ role }: { role: 'farmer' | 'operator' }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo">EcoCold</div>
        <div className="user-card">
          <div className="user-name">{user?.name}</div>
          <div className="user-role">{user?.role}</div>
        </div>

        {role === 'farmer' && (
          <nav className="nav">
            <NavLink to="/farmer" end className={navClasses}>
              Overview
            </NavLink>
            <NavLink to="/farmer/bookings" className={navClasses}>
              My bookings
            </NavLink>
            <NavLink to="/farmer/bookings/new" className={navClasses}>
              New booking
            </NavLink>
            <NavLink to="/farmer/payments" className={navClasses}>
              Payments
            </NavLink>
          </nav>
        )}

        {role === 'operator' && (
          <nav className="nav">
            <NavLink to="/operator" end className={navClasses}>
              Overview
            </NavLink>
            <NavLink to="/operator/hubs" className={navClasses}>
              Storage hubs
            </NavLink>
            <NavLink to="/operator/farmers" className={navClasses}>
              Farmers
            </NavLink>
            <NavLink to="/operator/bookings" className={navClasses}>
              Bookings
            </NavLink>
            <NavLink to="/operator/payments" className={navClasses}>
              Payments
            </NavLink>
            <NavLink to="/operator/simulation" className={navClasses}>
              Simulation
            </NavLink>
          </nav>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

