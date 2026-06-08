import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../api/api'

export default function BusinessOwnerPage() {
  const [step, setStep] = useState(1)
  const [businessId, setBusinessId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/api/businesses/my').then(() => navigate('/owner/manage')).catch(() => {})
  }, [navigate])

  const [bizName, setBizName] = useState('')
  const [bizCategory, setBizCategory] = useState('')
  const [bizDescription, setBizDescription] = useState('')

  const [serviceName, setServiceName] = useState('')
  const [durationMins, setDurationMins] = useState('')
  const [price, setPrice] = useState('')
  const [services, setServices] = useState([])

  const [staffName, setStaffName] = useState('')
  const [staffRole, setStaffRole] = useState('')
  const [staffList, setStaffList] = useState([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleCreateBusiness = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/api/businesses', {
        name: bizName,
        category: bizCategory,
        description: bizDescription
      })
      setBusinessId(res.data.id)
      setStep(2)
    } catch {
      setError('Failed to create business.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddService = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await api.post('/api/services', {
        name: serviceName,
        durationMins: parseInt(durationMins),
        price: parseFloat(price),
        businessId
      })
      setServices(prev => [...prev, { name: serviceName, durationMins, price }])
      setServiceName('')
      setDurationMins('')
      setPrice('')
    } catch {
      setError('Failed to add service.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddStaff = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await api.post('/api/staff', {
        name: staffName,
        role: staffRole,
        businessId
      })
      setStaffList(prev => [...prev, { name: staffName, role: staffRole }])
      setStaffName('')
      setStaffRole('')
    } catch {
      setError('Failed to add staff.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-[#EFE6D9] rounded-xl px-4 py-3 text-[#3E342E] outline-none focus:border-[#E87E5B] bg-white"
  const labelClass = "text-sm font-semibold text-[#3E342E] mb-1 block"

  return (
    <div className="min-h-screen bg-[#FDFAF4]">
      <Navbar />
      <div className="max-w-lg mx-auto px-6 py-10">

        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map(n => (
            <div key={n} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${step >= n ? 'bg-[#E87E5B] text-white' : 'bg-[#EFE6D9] text-[#8C7F76]'}`}>
                {n}
              </div>
              {n < 3 && <div className={`w-16 h-1 rounded ${step > n ? 'bg-[#E87E5B]' : 'bg-[#EFE6D9]'}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-[#F7DCD2] text-[#B23C28] rounded-xl px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="font-['Bricolage_Grotesque'] text-3xl font-extrabold text-[#3E342E] mb-2">
              Create your business
            </h1>
            <p className="text-[#8C7F76] mb-6">Step 1 of 3 — Business details</p>
            <form onSubmit={handleCreateBusiness} className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>Business name</label>
                <input type="text" value={bizName}
                  onChange={e => setBizName(e.target.value)}
                  className={inputClass} placeholder="e.g. Pawsh Grooming Co." required />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <input type="text" value={bizCategory}
                  onChange={e => setBizCategory(e.target.value)}
                  className={inputClass} placeholder="e.g. Full-Service Grooming" required />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea value={bizDescription}
                  onChange={e => setBizDescription(e.target.value)}
                  className={inputClass} rows={3}
                  placeholder="Tell customers about your business..." />
              </div>
              <button type="submit" disabled={loading}
                className="bg-[#E87E5B] text-white font-bold py-3 rounded-xl hover:bg-[#d46e4b] transition-colors disabled:opacity-50">
                {loading ? 'Creating...' : 'Continue →'}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="font-['Bricolage_Grotesque'] text-3xl font-extrabold text-[#3E342E] mb-2">
              Add services
            </h1>
            <p className="text-[#8C7F76] mb-6">Step 2 of 3 — What do you offer? (optional)</p>

            {services.length > 0 && (
              <ul className="mb-6 flex flex-col gap-2">
                {services.map((s, i) => (
                  <li key={i} className="flex items-center justify-between bg-white border border-[#EFE6D9] rounded-xl px-4 py-3">
                    <span className="font-semibold text-[#3E342E]">{s.name}</span>
                    <span className="text-sm text-[#8C7F76]">{s.durationMins} min · ${s.price}</span>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleAddService} className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>Service name</label>
                <input type="text" value={serviceName}
                  onChange={e => setServiceName(e.target.value)}
                  className={inputClass} placeholder="e.g. Full Groom & Style" />
              </div>
              <div>
                <label className={labelClass}>Duration (minutes)</label>
                <input type="number" value={durationMins}
                  onChange={e => setDurationMins(e.target.value)}
                  className={inputClass} placeholder="e.g. 60" />
              </div>
              <div>
                <label className={labelClass}>Price ($)</label>
                <input type="number" value={price}
                  onChange={e => setPrice(e.target.value)}
                  className={inputClass} placeholder="e.g. 45" />
              </div>
              <button
                type="submit"
                disabled={loading || !serviceName || !durationMins || !price}
                className="border border-[#E87E5B] text-[#E87E5B] font-bold py-3 rounded-xl hover:bg-[#FFF0EA] transition-colors disabled:opacity-40">
                {loading ? 'Adding...' : '+ Add service'}
              </button>
            </form>

            <button
              onClick={() => setStep(3)}
              className="mt-4 w-full bg-[#E87E5B] text-white font-bold py-3 rounded-xl hover:bg-[#d46e4b] transition-colors">
              Continue →
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="font-['Bricolage_Grotesque'] text-3xl font-extrabold text-[#3E342E] mb-2">
              Add staff
            </h1>
            <p className="text-[#8C7F76] mb-6">Step 3 of 3 — Who will serve customers? (optional)</p>

            {staffList.length > 0 && (
              <ul className="mb-6 flex flex-col gap-2">
                {staffList.map((s, i) => (
                  <li key={i} className="flex items-center justify-between bg-white border border-[#EFE6D9] rounded-xl px-4 py-3">
                    <span className="font-semibold text-[#3E342E]">{s.name}</span>
                    <span className="text-sm text-[#8C7F76]">{s.role}</span>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleAddStaff} className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>Staff name</label>
                <input type="text" value={staffName}
                  onChange={e => setStaffName(e.target.value)}
                  className={inputClass} placeholder="e.g. Ava Mitchell" />
              </div>
              <div>
                <label className={labelClass}>Role</label>
                <input type="text" value={staffRole}
                  onChange={e => setStaffRole(e.target.value)}
                  className={inputClass} placeholder="e.g. Master Groomer" />
              </div>
              <button
                type="submit"
                disabled={loading || !staffName || !staffRole}
                className="border border-[#E87E5B] text-[#E87E5B] font-bold py-3 rounded-xl hover:bg-[#FFF0EA] transition-colors disabled:opacity-40">
                {loading ? 'Adding...' : '+ Add staff member'}
              </button>
            </form>

            <button
              onClick={() => navigate('/owner/manage')}
              className="mt-4 w-full bg-[#E87E5B] text-white font-bold py-3 rounded-xl hover:bg-[#d46e4b] transition-colors">
              Finish setup →
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
