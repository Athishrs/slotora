import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Icon } from '../components/ui'
import api from '../api/api'

export default function ManageBusinessPage() {
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const [serviceName, setServiceName] = useState('')
  const [durationMins, setDurationMins] = useState('')
  const [price, setPrice] = useState('')
  const [addingService, setAddingService] = useState(false)

  const [staffName, setStaffName] = useState('')
  const [staffRole, setStaffRole] = useState('')
  const [addingStaff, setAddingStaff] = useState(false)

  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/api/businesses/my')
      .then(res => setBusiness(res.data))
      .catch(() => navigate('/owner'))
      .finally(() => setLoading(false))
  }, [navigate])

  const handleAddService = async (e) => {
    e.preventDefault()
    setAddingService(true)
    setError(null)
    try {
      const res = await api.post('/api/services', {
        name: serviceName,
        durationMins: parseInt(durationMins),
        price: parseFloat(price),
        businessId: business.id,
      })
      setBusiness(prev => ({ ...prev, services: [...prev.services, res.data] }))
      setServiceName('')
      setDurationMins('')
      setPrice('')
    } catch {
      setError('Failed to add service.')
    } finally {
      setAddingService(false)
    }
  }

  const handleDeleteService = async (id) => {
    try {
      await api.delete(`/api/services/${id}`)
      setBusiness(prev => ({ ...prev, services: prev.services.filter(s => s.id !== id) }))
    } catch {
      setError('Failed to remove service.')
    }
  }

  const handleAddStaff = async (e) => {
    e.preventDefault()
    setAddingStaff(true)
    setError(null)
    try {
      const res = await api.post('/api/staff', {
        name: staffName,
        role: staffRole,
        businessId: business.id,
      })
      setBusiness(prev => ({ ...prev, staff: [...prev.staff, res.data] }))
      setStaffName('')
      setStaffRole('')
    } catch {
      setError('Failed to add staff.')
    } finally {
      setAddingStaff(false)
    }
  }

  const handleDeleteStaff = async (id) => {
    try {
      await api.delete(`/api/staff/${id}`)
      setBusiness(prev => ({ ...prev, staff: prev.staff.filter(s => s.id !== id) }))
    } catch {
      setError('Failed to remove staff member.')
    }
  }

  const inputClass = "w-full bg-white border border-[#EFE6D9] rounded-[16px] px-4 py-3 text-[13.5px] text-[#3E342E] outline-none focus:border-[#E87E5B] transition-colors"
  const labelClass = "block text-[12.5px] font-semibold text-[#3E342E] mb-1.5"

  if (loading) return (
    <div className="min-h-screen bg-[#FDFAF4] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#E87E5B] border-t-transparent animate-spin" />
    </div>
  )

  if (!business) return null

  return (
    <div className="min-h-screen bg-[#FDFAF4]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-5 md:px-6 py-6 md:py-8">

        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-[#8C7F76] hover:text-[#3E342E] transition-colors mb-5"
          style={{ background: 'none', border: 'none', padding: 0 }}>
          <Icon name="arrowLeft" size={15} color="currentColor" />
          Back
        </button>

        {/* Business header */}
        <div className="bg-white border border-[#EFE6D9] rounded-[24px] p-5 mb-6"
          style={{ boxShadow: '0 2px 8px rgba(62,52,46,0.06)' }}>
          <span className="text-[11px] font-bold tracking-widest uppercase text-[#8C7F76]">{business.category}</span>
          <h1 className="text-2xl font-extrabold text-[#3E342E] mt-1 mb-1">{business.name}</h1>
          {business.description && (
            <p className="text-[13px] text-[#8C7F76]">{business.description}</p>
          )}
        </div>

        {error && (
          <div className="bg-[#F7DCD2] text-[#B23C28] rounded-xl px-4 py-3 mb-5 text-sm">{error}</div>
        )}

        {/* Services section */}
        <section className="mb-8">
          <h2 className="text-[18px] font-extrabold text-[#3E342E] mb-4">Services</h2>

          {business.services.length > 0 ? (
            <ul className="flex flex-col gap-2.5 mb-5">
              {business.services.map(s => (
                <li key={s.id}
                  className="flex items-center justify-between bg-white border border-[#EFE6D9] rounded-[18px] px-4 py-3"
                  style={{ boxShadow: '0 1px 4px rgba(62,52,46,0.05)' }}>
                  <div>
                    <div className="font-semibold text-[14px] text-[#3E342E]">{s.name}</div>
                    <div className="text-[12px] text-[#8C7F76] mt-0.5">{s.durationMins} min · ${s.price}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteService(s.id)}
                    className="text-[12.5px] font-semibold text-[#B23C28] hover:bg-[#F7DCD2] px-3 py-1.5 rounded-[12px] transition-colors">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-[#8C7F76] mb-5">No services yet.</p>
          )}

          <form onSubmit={handleAddService} className="bg-white border border-[#EFE6D9] rounded-[20px] p-4 flex flex-col gap-3"
            style={{ boxShadow: '0 1px 4px rgba(62,52,46,0.05)' }}>
            <p className="text-[12.5px] font-bold text-[#3E342E]">Add a service</p>
            <div>
              <label className={labelClass}>Service name</label>
              <input type="text" value={serviceName} onChange={e => setServiceName(e.target.value)}
                className={inputClass} placeholder="e.g. Full Groom & Style" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Duration (min)</label>
                <input type="number" value={durationMins} onChange={e => setDurationMins(e.target.value)}
                  className={inputClass} placeholder="e.g. 60" />
              </div>
              <div>
                <label className={labelClass}>Price ($)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)}
                  className={inputClass} placeholder="e.g. 45" />
              </div>
            </div>
            <button
              type="submit"
              disabled={addingService || !serviceName || !durationMins || !price}
              className="border border-[#E87E5B] text-[#E87E5B] font-bold py-2.5 rounded-[14px] text-[13.5px] hover:bg-[#FFF0EA] transition-colors disabled:opacity-40">
              {addingService ? 'Adding…' : '+ Add service'}
            </button>
          </form>
        </section>

        {/* Staff section */}
        <section>
          <h2 className="text-[18px] font-extrabold text-[#3E342E] mb-4">Staff</h2>

          {business.staff.length > 0 ? (
            <ul className="flex flex-col gap-2.5 mb-5">
              {business.staff.map(s => (
                <li key={s.id}
                  className="flex items-center justify-between bg-white border border-[#EFE6D9] rounded-[18px] px-4 py-3"
                  style={{ boxShadow: '0 1px 4px rgba(62,52,46,0.05)' }}>
                  <div>
                    <div className="font-semibold text-[14px] text-[#3E342E]">{s.name}</div>
                    <div className="text-[12px] text-[#8C7F76] mt-0.5">{s.role}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteStaff(s.id)}
                    className="text-[12.5px] font-semibold text-[#B23C28] hover:bg-[#F7DCD2] px-3 py-1.5 rounded-[12px] transition-colors">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-[#8C7F76] mb-5">No staff added yet.</p>
          )}

          <form onSubmit={handleAddStaff} className="bg-white border border-[#EFE6D9] rounded-[20px] p-4 flex flex-col gap-3"
            style={{ boxShadow: '0 1px 4px rgba(62,52,46,0.05)' }}>
            <p className="text-[12.5px] font-bold text-[#3E342E]">Add a staff member</p>
            <div>
              <label className={labelClass}>Name</label>
              <input type="text" value={staffName} onChange={e => setStaffName(e.target.value)}
                className={inputClass} placeholder="e.g. Ava Mitchell" />
            </div>
            <div>
              <label className={labelClass}>Role</label>
              <input type="text" value={staffRole} onChange={e => setStaffRole(e.target.value)}
                className={inputClass} placeholder="e.g. Master Groomer" />
            </div>
            <button
              type="submit"
              disabled={addingStaff || !staffName || !staffRole}
              className="border border-[#E87E5B] text-[#E87E5B] font-bold py-2.5 rounded-[14px] text-[13.5px] hover:bg-[#FFF0EA] transition-colors disabled:opacity-40">
              {addingStaff ? 'Adding…' : '+ Add staff member'}
            </button>
          </form>
        </section>

      </div>
    </div>
  )
}
