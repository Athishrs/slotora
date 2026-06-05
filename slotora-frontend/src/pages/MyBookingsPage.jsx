import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../api/api'

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/api/bookings')
        setBookings(res.data)
      } catch (err) {
        console.error('Failed to fetch bookings', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const handleCancel = async (id) => {
    try {
      await api.delete(`/api/bookings/${id}`)
      setBookings(bookings.map(b =>
        b.id === id ? { ...b, status: 'CANCELLED' } : b
      ))
    } catch (err) {
      console.error('Failed to cancel booking', err)
    }
  }

  const statusColors = {
    PENDING:   { bg: '#FCE7CF', text: '#B16A1E', dot: '#F9A869' },
    CONFIRMED: { bg: '#DDEDE3', text: '#3F7A5F', dot: '#6BAF92' },
    CANCELLED: { bg: '#F7DCD2', text: '#B23C28', dot: '#D9603C' },
  }

  if (loading) return (
    <div className="min-h-screen bg-[#FDFAF4] flex items-center justify-center">
      <p className="text-[#8C7F76]">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FDFAF4]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-['Bricolage_Grotesque'] text-3xl font-extrabold text-[#3E342E] mb-2">
          My Bookings
        </h1>
        <p className="text-[#8C7F76] mb-8">Manage your appointments</p>

        {bookings.length === 0 && (
          <div className="bg-white rounded-[20px] p-8 text-center border border-[#EFE6D9]">
            <p className="text-[#8C7F76]">No bookings yet.</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {bookings.map(b => {
            const s = statusColors[b.status]
            return (
              <div key={b.id} className="bg-white rounded-[20px] p-6 shadow-sm border border-[#EFE6D9]">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-[#3E342E] text-lg">{b.serviceName}</h3>
                    <p className="text-sm text-[#8C7F76]">with {b.staffName}</p>
                  </div>
                  <span style={{ background: s.bg, color: s.text }}
                    className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full">
                    <span style={{ background: s.dot }} className="w-2 h-2 rounded-full" />
                    {b.status}
                  </span>
                </div>
                <p className="text-sm text-[#3E342E] mb-1">
                  {new Date(b.appointmentTime).toLocaleString()}
                </p>
                {b.notes && <p className="text-sm text-[#8C7F76] mb-4">{b.notes}</p>}
                {b.status !== 'CANCELLED' && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    className="text-sm font-semibold text-[#B23C28] hover:underline"
                  >
                    Cancel booking
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}