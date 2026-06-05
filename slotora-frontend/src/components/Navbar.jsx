import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-[#EFE6D9] px-6 py-4 flex items-center justify-between">
      <Link to="/dashboard" className="font-['Bricolage_Grotesque'] text-xl font-extrabold text-[#E87E5B]">
        Slotora
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/bookings" className="text-sm font-semibold text-[#3E342E] hover:text-[#E87E5B]">
          My Bookings
        </Link>
        <Link to="/book" className="text-sm font-semibold text-[#3E342E] hover:text-[#E87E5B]">
          Book Now
        </Link>
        <span className="text-sm text-[#8C7F76]">Hi, {user?.name}</span>
        <button
          onClick={handleLogout}
          className="bg-[#E87E5B] text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-[#d46e4b] transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}