import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../api/api'

export default function NewBookingPage() {
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState('')
  const [staffId, setStaffId] = useState(1)
  const [appointmentTime, setAppointmentTime] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/api/services')
        setServices(res.data)
      } catch (err) {
        console.error('Failed to fetch services', err)
      }
    }
    fetchServices()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await api.post('/api/bookings', {
        serviceId: parseInt(selectedService),
        staffId: parseInt(staffId),
        appointmentTime,
        notes
      })
      navigate('/bookings')
    } catch (err) {
      setError('Failed to create booking. Slot may already be taken.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFAF4]">
      <Navbar />
      <div className="max-w-lg mx-auto px-6 py-10">
        <h1 className="font-['Bricolage_Grotesque'] text-3xl font-extrabold text-[#3E342E] mb-2">
          New Booking
        </h1>
        <p className="text-[#8C7F76] mb-8">Fill in the details below</p>

        {error && (
          <div className="bg-[#F7DCD2] text-[#B23C28] rounded-xl px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-[#3E342E] mb-1 block">Service</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full border border-[#EFE6D9] rounded-xl px-4 py-3 text-[#3E342E] outline-none focus:border-[#E87E5B] bg-white"
              required
            >
              <option value="">Select a service</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.durationMins} mins — ${s.price}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#3E342E] mb-1 block">Date & Time</label>
            <input
              type="datetime-local"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="w-full border border-[#EFE6D9] rounded-xl px-4 py-3 text-[#3E342E] outline-none focus:border-[#E87E5B]"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[#3E342E] mb-1 block">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-[#EFE6D9] rounded-xl px-4 py-3 text-[#3E342E] outline-none focus:border-[#E87E5B] resize-none"
              rows={3}
              placeholder="Any special requests..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#E87E5B] text-white font-bold py-3 rounded-xl hover:bg-[#d46e4b] transition-colors disabled:opacity-50"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  )
}