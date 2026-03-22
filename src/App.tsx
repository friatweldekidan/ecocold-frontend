import { Route, Routes, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { FarmerDashboard } from './pages/farmer/FarmerDashboard'
import { FarmerBookings } from './pages/farmer/FarmerBookings'
import { FarmerNewBooking } from './pages/farmer/FarmerNewBooking'
import { FarmerPayments } from './pages/farmer/FarmerPayments'
import { OperatorDashboard } from './pages/operator/OperatorDashboard'
import { OperatorHubs } from './pages/operator/OperatorHubs'
import { OperatorFarmers } from './pages/operator/OperatorFarmers'
import { OperatorBookings } from './pages/operator/OperatorBookings'
import { OperatorPayments } from './pages/operator/OperatorPayments'
import { OperatorSimulation } from './pages/operator/OperatorSimulation'
import { MainLayout } from './components/layout/MainLayout'

function ProtectedRoute({
  children,
  roles,
}: {
  children: JSX.Element
  roles?: string[]
}) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/farmer/*"
          element={
            <ProtectedRoute roles={['farmer']}>
              <MainLayout role="farmer" />
            </ProtectedRoute>
          }
        >
          <Route index element={<FarmerDashboard />} />
          <Route path="bookings" element={<FarmerBookings />} />
          <Route path="bookings/new" element={<FarmerNewBooking />} />
          <Route path="payments" element={<FarmerPayments />} />
        </Route>

        <Route
          path="/operator/*"
          element={
            <ProtectedRoute roles={['admin', 'hub_owner']}>
              <MainLayout role="operator" />
            </ProtectedRoute>
          }
        >
          <Route index element={<OperatorDashboard />} />
          <Route path="hubs" element={<OperatorHubs />} />
          <Route path="farmers" element={<OperatorFarmers />} />
          <Route path="bookings" element={<OperatorBookings />} />
          <Route path="payments" element={<OperatorPayments />} />
          <Route path="simulation" element={<OperatorSimulation />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

