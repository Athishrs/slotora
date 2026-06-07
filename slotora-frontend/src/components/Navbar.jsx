import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Icon } from './ui'

function Wordmark() {
  return (
    <Link to="/dashboard" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8, background: '#E87E5B', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 16, fontFamily: "'Bricolage Grotesque', sans-serif", flexShrink: 0,
      }}>S</div>
      <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 18, color: '#3E342E', letterSpacing: '-0.02em' }}>
        Slotora
      </span>
    </Link>
  )
}

export default function Navbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const active = location.pathname === '/dashboard' ? 'Dashboard'
    : location.pathname === '/bookings' ? 'My Bookings'
    : location.pathname === '/owner' ? 'Owner'
    : ''

  return (
    <nav className="bg-white border-b border-[#EFE6D9] px-5 md:px-7 py-4 flex items-center justify-between"
      style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <Wordmark />

      {/* Desktop nav links */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/dashboard" style={{ textDecoration: 'none', fontSize: 13.5, fontWeight: active === 'Dashboard' ? 700 : 500, color: active === 'Dashboard' ? '#E87E5B' : '#8C7F76' }}>
          Dashboard
        </Link>
        <Link to="/bookings" style={{ textDecoration: 'none', fontSize: 13.5, fontWeight: active === 'My Bookings' ? 700 : 500, color: active === 'My Bookings' ? '#E87E5B' : '#8C7F76' }}>
          My Bookings
        </Link>
        <Link to="/owner" style={{ textDecoration: 'none', fontSize: 13.5, fontWeight: active === 'Owner' ? 700 : 500, color: active === 'Owner' ? '#E87E5B' : '#8C7F76' }}>
          List your business
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FBEBD9] flex items-center justify-center">
            <Icon name="user" size={15} color="#8C7F76" />
          </div>
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="text-[13px] text-[#8C7F76] bg-transparent border-none cursor-pointer p-0"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            Logout
          </button>
        </div>
      </div>

      {/* Mobile: icon tab strip */}
      <div className="flex md:hidden items-center gap-1">
        <Link to="/dashboard"
          className="flex flex-col items-center px-3 py-1.5 rounded-xl"
          style={{ textDecoration: 'none', background: active === 'Dashboard' ? '#FBEBD9' : 'transparent' }}>
          <Icon name="search" size={20} color={active === 'Dashboard' ? '#E87E5B' : '#8C7F76'} />
          <span style={{ fontSize: 10, fontWeight: 600, color: active === 'Dashboard' ? '#E87E5B' : '#8C7F76', marginTop: 2 }}>Discover</span>
        </Link>
        <Link to="/bookings"
          className="flex flex-col items-center px-3 py-1.5 rounded-xl"
          style={{ textDecoration: 'none', background: active === 'My Bookings' ? '#FBEBD9' : 'transparent' }}>
          <Icon name="calendar" size={20} color={active === 'My Bookings' ? '#E87E5B' : '#8C7F76'} />
          <span style={{ fontSize: 10, fontWeight: 600, color: active === 'My Bookings' ? '#E87E5B' : '#8C7F76', marginTop: 2 }}>Bookings</span>
        </Link>
        <Link to="/owner"
          className="flex flex-col items-center px-3 py-1.5 rounded-xl"
          style={{ textDecoration: 'none', background: active === 'Owner' ? '#FBEBD9' : 'transparent' }}>
          <Icon name="star" size={20} color={active === 'Owner' ? '#E87E5B' : '#8C7F76'} />
          <span style={{ fontSize: 10, fontWeight: 600, color: active === 'Owner' ? '#E87E5B' : '#8C7F76', marginTop: 2 }}>List</span>
        </Link>
        <button
          onClick={() => { logout(); navigate('/login') }}
          className="flex flex-col items-center px-3 py-1.5 rounded-xl bg-transparent border-none cursor-pointer">
          <Icon name="user" size={20} color="#8C7F76" />
          <span style={{ fontSize: 10, fontWeight: 600, color: '#8C7F76', marginTop: 2 }}>Logout</span>
        </button>
      </div>
    </nav>
  )
}