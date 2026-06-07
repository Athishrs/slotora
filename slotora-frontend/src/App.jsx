import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import MyBookingsPage from './pages/MyBookingsPage'
import NewBookingPage from './pages/NewBookingPage'
import LandingPage from './pages/LandingPage'
import BusinessOwnerPage from './pages/BusinessOwnerPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />
      <Route path="/bookings" element={
        <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
      } />
      <Route path="/book" element={
        <ProtectedRoute><NewBookingPage /></ProtectedRoute>
      } />
      <Route path="/owner" element={
        <ProtectedRoute><BusinessOwnerPage /></ProtectedRoute>
      } />
    </Routes>
  )
}