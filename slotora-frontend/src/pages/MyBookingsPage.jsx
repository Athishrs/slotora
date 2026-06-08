import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Icon, Monogram, StatusBadge, hashColor } from '../components/ui'
import api from '../api/api'

function BookingCard({ booking, onCancel }) {
  const cancelled = booking.status === 'CANCELLED'
  const color = hashColor(booking.businessName || booking.serviceName || '')
  const dt = new Date(booking.appointmentTime)
  const dateStr = dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  const timeStr = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  return (
    <div className="bg-white border border-[#EFE6D9] rounded-[24px] p-4"
      style={{ boxShadow: '0 2px 8px rgba(62,52,46,0.06)', opacity: cancelled ? 0.72 : 1 }}>
      <div className="flex gap-3 items-start">
        <Monogram name={booking.businessName || booking.serviceName || 'S'} color={color} size={42} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[14.5px] text-[#3E342E] leading-snug"
                style={{ textDecoration: cancelled ? 'line-through' : 'none' }}>
                {booking.serviceName}
              </div>
              <div className="text-[12px] text-[#8C7F76] mt-0.5 truncate">
                {booking.businessName ? `${booking.businessName} · ` : ''}{booking.staffName || 'Any available staff'}
              </div>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          <div className="flex flex-wrap gap-3 mt-2.5 text-[12px] text-[#8C7F76]">
            <span className="flex items-center gap-1.5">
              <Icon name="calendar" size={12} color="#8C7F76" />
              {dateStr}
            </span>
            <span className="flex items-center gap-1.5">
              <Icon name="clock" size={12} color="#8C7F76" />
              {timeStr}
            </span>
          </div>

          {booking.notes && (
            <div className="mt-2.5 bg-[#FBEBD9] text-[#8C7F76] text-[12px] italic px-3 py-2 rounded-xl">
              "{booking.notes}"
            </div>
          )}
        </div>
      </div>

      {!cancelled && (
        <div className="flex gap-2 mt-3.5 pt-3.5 border-t border-[#EFE6D9]">
          <button
            onClick={() => onCancel(booking.id)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[#B23C28] px-4 py-2 rounded-[16px] border border-[#EFE6D9] bg-white hover:bg-[#F7DCD2] transition-colors cursor-pointer"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            <Icon name="x" size={14} color="#B23C28" />
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/api/bookings')
      .then(res => setBookings(res.data))
      .catch(err => console.error('Failed to fetch bookings', err))
      .finally(() => setLoading(false))
  }, [])

  const handleCancel = async (id) => {
    try {
      await api.delete(`/api/bookings/${id}`)
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b))
    } catch (err) {
      console.error('Failed to cancel booking', err)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#FDFAF4] flex items-center justify-center" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#E87E5B] border-t-transparent animate-spin" />
        <p className="text-[#8C7F76] text-sm">Loading bookings…</p>
      </div>
    </div>
  )

  const upcoming = bookings.filter(b => b.status !== 'CANCELLED')

  return (
    <div className="min-h-screen bg-[#FDFAF4]" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-5 md:px-6 py-6 md:py-7">
        <button
          onClick={() => navigate('/dashboard')}
          className="self-start flex items-center gap-1.5 text-[13px] font-semibold text-[#8C7F76] hover:text-[#3E342E] transition-colors mb-4 cursor-pointer"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", background: 'none', border: 'none', padding: 0 }}>
          <Icon name="arrowLeft" size={15} color="currentColor" />
          Back
        </button>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 800, letterSpacing: '-0.02em', color: '#3E342E', margin: '0 0 4px' }}>
          My bookings
        </h2>
        <p className="text-[13px] text-[#8C7F76] mb-6">
          {upcoming.length} upcoming · {bookings.length} total
        </p>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-[24px] p-10 md:p-12 text-center border border-[#EFE6D9]">
            <div className="w-12 h-12 rounded-full bg-[#FBEBD9] flex items-center justify-center mx-auto mb-3">
              <Icon name="calendar" size={22} color="#E87E5B" />
            </div>
            <p className="font-semibold text-[#3E342E] mb-1">No bookings yet</p>
            <p className="text-[13px] text-[#8C7F76]">Head to the dashboard to book your first appointment.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {bookings.map(b => (
              <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
