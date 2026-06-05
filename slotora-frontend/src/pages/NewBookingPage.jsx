import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Icon, Monogram, hashColor } from '../components/ui'
import api from '../api/api'

const TIME_SLOTS = ['9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:30 PM']

export default function NewBookingPage() {
  const [services, setServices] = useState([])
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    api.get('/api/services').then(res => {
      setServices(res.data)
      const preselect = location.state?.serviceId
      if (preselect) setSelectedServiceId(String(preselect))
      else if (res.data.length > 0) setSelectedServiceId(String(res.data[0].id))
    }).catch(err => console.error('Failed to fetch services', err))
  }, [location.state])

  const selectedService = services.find(s => String(s.id) === String(selectedServiceId))

  const buildAppointmentTime = () => {
    if (!selectedDate || !selectedSlot) return ''
    const [time, meridiem] = selectedSlot.split(' ')
    let [h, m] = time.split(':').map(Number)
    if (meridiem === 'PM' && h !== 12) h += 12
    if (meridiem === 'AM' && h === 12) h = 0
    return `${selectedDate}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedSlot) { setError('Please select a time slot.'); return }
    setLoading(true)
    setError(null)
    try {
      await api.post('/api/bookings', {
        serviceId: parseInt(selectedServiceId),
        staffId: 1,
        appointmentTime: buildAppointmentTime(),
        notes,
      })
      navigate('/bookings')
    } catch {
      setError('Failed to create booking. Slot may already be taken.')
    } finally {
      setLoading(false)
    }
  }

  const bizName = selectedService?.businessName || 'Grooming Salon'
  const color = hashColor(bizName)

  const summaryRows = selectedService ? [
    ['Date',     selectedDate ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '—'],
    ['Time',     selectedSlot || '—'],
    ['Duration', `${selectedService.durationMins} min`],
  ] : []

  return (
    <div className="min-h-screen bg-[#FDFAF4]" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-5 md:px-7 py-6 md:py-7">
        <button
          onClick={() => navigate('/dashboard')}
          className="self-start flex items-center gap-1.5 text-[13px] font-semibold text-[#8C7F76] hover:text-[#3E342E] transition-colors mb-4 cursor-pointer"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", background: 'none', border: 'none', padding: 0 }}>
          <Icon name="arrowLeft" size={15} color="currentColor" />
          Back
        </button>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 800, letterSpacing: '-0.02em', color: '#3E342E', margin: '0 0 4px' }}>
          New appointment
        </h2>
        <p className="text-[13px] text-[#8C7F76] mb-6 md:mb-7">Choose a service and time that works for you.</p>

        <form onSubmit={handleSubmit}>
          {/* On mobile: stacked. On md+: 2-column */}
          <div className="flex flex-col md:grid md:grid-cols-[1.4fr_1fr] gap-6 items-start">

            {/* Form */}
            <div className="flex flex-col gap-5 w-full">
              {error && (
                <div className="bg-[#F7DCD2] text-[#B23C28] rounded-xl px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              {/* Service select */}
              <div>
                <label className="block text-[12.5px] font-semibold text-[#3E342E] mb-1.5">Service</label>
                <select
                  value={selectedServiceId}
                  onChange={e => setSelectedServiceId(e.target.value)}
                  required
                  className="w-full bg-white border border-[#EFE6D9] rounded-[20px] px-4 py-3 text-[13.5px] text-[#3E342E] outline-none focus:border-[#E87E5B] transition-colors cursor-pointer"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                  <option value="">Select a service</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} · {s.durationMins}m · ${s.price}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-[12.5px] font-semibold text-[#3E342E] mb-1.5">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  required
                  className="w-full bg-white border border-[#EFE6D9] rounded-[20px] px-4 py-3 text-[13.5px] text-[#3E342E] outline-none focus:border-[#E87E5B] transition-colors"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                />
              </div>

              {/* Time slots — 2 cols on mobile, 3 on md+ */}
              <div>
                <span className="block text-[12.5px] font-semibold text-[#3E342E] mb-2.5">Time</span>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  {TIME_SLOTS.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedSlot(t)}
                      className="text-center py-3 md:py-2.5 rounded-[20px] text-[13.5px] md:text-[13px] font-semibold border transition-colors cursor-pointer"
                      style={{
                        background: selectedSlot === t ? '#E87E5B' : '#fff',
                        color: selectedSlot === t ? '#fff' : '#3E342E',
                        borderColor: selectedSlot === t ? '#E87E5B' : '#EFE6D9',
                        fontFamily: "'Hanken Grotesk', sans-serif",
                      }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[12.5px] font-semibold text-[#3E342E] mb-1.5">Notes for the groomer</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="e.g. Bailey is nervous with dryers — please take it slow."
                  className="w-full bg-white border border-[#EFE6D9] rounded-[20px] px-4 py-3 text-[13px] text-[#3E342E] outline-none focus:border-[#E87E5B] transition-colors resize-none placeholder-[#8C7F76]"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                />
              </div>
            </div>

            {/* Summary card */}
            <div className="bg-white border border-[#EFE6D9] rounded-[28px] p-5 w-full"
              style={{ boxShadow: '0 2px 8px rgba(62,52,46,0.06)' }}>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#8C7F76]">Summary</span>

              {selectedService ? (
                <>
                  <div className="flex gap-3 items-center my-4 pb-4 border-b border-[#EFE6D9]">
                    <Monogram name={bizName} color={color} size={44} />
                    <div className="min-w-0">
                      <div className="font-bold text-[14.5px] text-[#3E342E] truncate">{selectedService.name}</div>
                      <div className="text-[12.5px] text-[#8C7F76] mt-0.5 truncate">{bizName}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {summaryRows.map(([k, v]) => (
                      <div key={k} className="flex justify-between text-[13px] py-1.5">
                        <span className="text-[#8C7F76]">{k}</span>
                        <span className="font-semibold text-[#3E342E]">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[15px] py-3 mt-2 border-t border-[#EFE6D9]">
                    <span className="font-bold text-[#3E342E]">Total</span>
                    <span className="font-extrabold text-[#3E342E]">${selectedService.price}</span>
                  </div>
                </>
              ) : (
                <div className="my-6 text-[13px] text-[#8C7F76] text-center">
                  Select a service to see the summary.
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !selectedService}
                className="w-full bg-[#E87E5B] text-white font-bold py-3.5 rounded-[20px] hover:bg-[#d46e4b] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                style={{ fontSize: 14.5, fontFamily: "'Hanken Grotesk', sans-serif" }}>
                {loading ? 'Booking…' : <><span>Confirm booking</span><Icon name="arrow" size={16} color="#fff" /></>}
              </button>
              <p className="text-[11.5px] text-[#8C7F76] text-center mt-3">
                You won't be charged until the appointment.
              </p>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}
