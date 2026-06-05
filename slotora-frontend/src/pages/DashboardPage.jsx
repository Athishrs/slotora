import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Icon, Monogram, hashColor } from '../components/ui'
import api from '../api/api'

const CATEGORIES = ['All', 'Grooming', 'Styling', 'Express', 'Mobile']

export default function DashboardPage() {
  const [businesses, setBusinesses] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bizRes, svcRes] = await Promise.all([
          api.get('/api/businesses'),
          api.get('/api/services'),
        ])
        setBusinesses(bizRes.data)
        setServices(svcRes.data)
      } catch (err) {
        console.error('Failed to fetch data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const bizMap = Object.fromEntries(businesses.map(b => [b.id, b]))

  const filtered = services.filter(s => {
    const q = search.toLowerCase()
    return !q || s.name.toLowerCase().includes(q) || bizMap[s.businessId]?.name?.toLowerCase().includes(q)
  })

  if (loading) return (
    <div className="min-h-screen bg-[#FDFAF4] flex items-center justify-center" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#E87E5B] border-t-transparent animate-spin" />
        <p className="text-[#8C7F76] text-sm">Loading services…</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FDFAF4]" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-5 md:px-7 py-6 md:py-7">

        {/* Header row — stacks on mobile */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">
          <div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 800, letterSpacing: '-0.02em', color: '#3E342E', margin: 0 }}>
              Book a service
            </h2>
            <p className="text-[13px] md:text-[13.5px] text-[#8C7F76] mt-1.5 mb-0">
              Pick from {services.length} services across {businesses.length} salons near you.
            </p>
          </div>
          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-[#EFE6D9] px-3.5 py-2.5 rounded-[20px] w-full md:w-56">
            <Icon name="search" size={15} color="#8C7F76" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search services…"
              className="bg-transparent outline-none text-[13px] text-[#3E342E] placeholder-[#8C7F76] flex-1 min-w-0"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif", border: 'none' }}
            />
          </div>
        </div>

        {/* Category chips — scrollable on mobile */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className="text-[12.5px] font-semibold px-4 py-1.5 rounded-full border transition-colors cursor-pointer shrink-0"
              style={{
                background: activeCategory === c ? '#E87E5B' : '#fff',
                color: activeCategory === c ? '#fff' : '#8C7F76',
                borderColor: activeCategory === c ? '#E87E5B' : '#EFE6D9',
                fontFamily: "'Hanken Grotesk', sans-serif",
              }}>
              {c}
            </button>
          ))}
        </div>

        {/* Service cards — 1 col on mobile, 2 on md+ */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-[20px] p-10 text-center border border-[#EFE6D9]">
            <p className="text-[#8C7F76] text-sm">No services found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-4">
            {filtered.map(s => {
              const biz = bizMap[s.businessId]
              const bizName = biz?.name || 'Salon'
              const color = hashColor(bizName)
              return (
                <div key={s.id}
                  className="bg-white border border-[#EFE6D9] rounded-[24px] p-4 flex gap-3.5 items-center"
                  style={{ boxShadow: '0 2px 8px rgba(62,52,46,0.06)' }}>
                  <Monogram name={bizName} color={color} size={46} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11.5px] text-[#8C7F76] mb-0.5 truncate">{bizName}</div>
                    <div className="font-bold text-[15px] text-[#3E342E] truncate">{s.name}</div>
                    <div className="flex gap-3 mt-1.5 text-[12px] text-[#8C7F76]">
                      <span className="flex items-center gap-1">
                        <Icon name="clock" size={13} color="#8C7F76" />
                        {s.durationMins}m
                      </span>
                      <span className="font-bold text-[#3E342E]">${s.price}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/book', { state: { serviceId: s.id } })}
                    className="text-[13px] font-semibold bg-[#E87E5B] text-white px-4 py-2 rounded-[16px] hover:bg-[#d46e4b] transition-colors cursor-pointer shrink-0"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                    Book
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
