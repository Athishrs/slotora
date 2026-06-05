import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../api/api'

export default function DashboardPage() {
  const [businesses, setBusinesses] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bizRes, svcRes] = await Promise.all([
          api.get('/api/businesses'),
          api.get('/api/services')
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

  if (loading) return (
    <div className="min-h-screen bg-[#FDFAF4] flex items-center justify-center">
      <p className="text-[#8C7F76]">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FDFAF4]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-['Bricolage_Grotesque'] text-3xl font-extrabold text-[#3E342E] mb-2">
          Welcome to Slotora
        </h1>
        <p className="text-[#8C7F76] mb-10">Book your next appointment below</p>

        <h2 className="font-['Bricolage_Grotesque'] text-xl font-bold text-[#3E342E] mb-4">
          Businesses
        </h2>
        <div className="grid grid-cols-1 gap-4 mb-10">
          {businesses.map(b => (
            <div key={b.id} className="bg-white rounded-[20px] p-6 shadow-sm border border-[#EFE6D9]">
              <h3 className="font-bold text-[#3E342E] text-lg">{b.name}</h3>
              <p className="text-sm text-[#8C7F76]">{b.category}</p>
              <p className="text-sm text-[#3E342E] mt-2">{b.description}</p>
            </div>
          ))}
        </div>

        <h2 className="font-['Bricolage_Grotesque'] text-xl font-bold text-[#3E342E] mb-4">
          Services
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {services.map(s => (
            <div key={s.id} className="bg-white rounded-[20px] p-6 shadow-sm border border-[#EFE6D9] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#3E342E]">{s.name}</h3>
                <p className="text-sm text-[#8C7F76]">{s.durationMins} mins</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-[#E87E5B]">${s.price}</span>
                <button
                  onClick={() => navigate('/book')}
                  className="bg-[#E87E5B] text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-[#d46e4b] transition-colors"
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}