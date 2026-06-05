import { useNavigate } from 'react-router-dom'
import { Icon, Monogram, StatusBadge } from '../components/ui'

const PREVIEW_BUSINESSES = [
  { name: 'Pawsh Grooming Co.', color: '#E87E5B' },
  { name: 'The Dapper Dog',     color: '#6BAF92' },
  { name: 'Bubbly Paws',        color: '#E0913B' },
  { name: 'Waggle & Wash',      color: '#C77E66' },
]

const PREVIEW_BOOKINGS = [
  { service: 'Full Groom & Style', business: 'Pawsh Grooming Co.', staff: 'Ava Mitchell', date: 'Sun, Jun 8',  time: '2:00 PM',  color: '#E87E5B' },
  { service: 'Breed-Specific Cut', business: 'The Dapper Dog',     staff: 'Lena Park',   date: 'Wed, Jun 11', time: '11:30 AM', color: '#6BAF92' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#FDFAF4] flex flex-col" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>

      {/* Top nav */}
      <div className="flex items-center justify-between px-5 md:px-8 py-4 md:py-5">
        <div className="flex items-center gap-2">
          <div style={{
            width: 30, height: 30, borderRadius: 8, background: '#E87E5B', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 17, fontFamily: "'Bricolage Grotesque', sans-serif",
          }}>S</div>
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 20, color: '#3E342E', letterSpacing: '-0.02em' }}>
            Slotora
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-[#3E342E] px-4 py-2 rounded-[20px] border border-[#EFE6D9] bg-white hover:bg-[#FAF5EE] transition-colors cursor-pointer"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            Log in
          </button>
          <button
            onClick={() => navigate('/register')}
            className="text-sm font-bold bg-[#E87E5B] text-white px-4 py-2 rounded-[20px] hover:bg-[#d46e4b] transition-colors cursor-pointer"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            Register
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 px-5 md:px-8 pb-8 items-center max-w-5xl mx-auto w-full">

        {/* Copy — always visible */}
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#FBEBD9] text-[#E87E5B] text-xs font-semibold px-3 py-1.5 rounded-full mb-4 md:mb-5">
            <Icon name="star" size={13} color="#E87E5B" />
            Trusted by 1,200+ grooming salons
          </div>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", lineHeight: 1.05, letterSpacing: '-0.03em', fontWeight: 800, color: '#3E342E', margin: '0 0 14px', fontSize: 'clamp(32px, 6vw, 44px)' }}>
            Grooming day,<br />sorted in seconds.
          </h1>
          <p className="text-[15px] md:text-base leading-relaxed text-[#8C7F76] mb-6 md:mb-7 max-w-md">
            Slotora gives every grooming salon a beautiful booking page — services, groomers, and schedules in one calm place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center justify-center gap-2 bg-[#E87E5B] text-white font-semibold text-sm px-5 py-3 rounded-[20px] hover:bg-[#d46e4b] transition-colors cursor-pointer"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
              Get started <Icon name="arrow" size={16} color="#fff" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center justify-center text-sm font-semibold text-[#3E342E] px-5 py-3 rounded-[20px] border border-[#EFE6D9] bg-white hover:bg-[#FAF5EE] transition-colors cursor-pointer"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
              Log in
            </button>
          </div>
        </div>

        {/* Preview card — hidden on mobile, shown on md+ */}
        <div className="hidden md:block bg-white border border-[#EFE6D9] rounded-[32px] p-5"
          style={{ boxShadow: '0 22px 48px -26px rgba(232,126,91,0.45)' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-bold text-[#3E342E]">Upcoming</span>
            <StatusBadge status="CONFIRMED" />
          </div>
          {PREVIEW_BOOKINGS.map((bk, i) => (
            <div key={i} className="flex gap-3 items-center py-3 border-t border-[#EFE6D9]">
              <Monogram name={bk.business} color={bk.color} size={42} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[14px] text-[#3E342E] truncate">{bk.service}</div>
                <div className="text-[12px] text-[#8C7F76] mt-0.5 truncate">{bk.business} · {bk.staff}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[12px] font-semibold text-[#3E342E]">{bk.date}</div>
                <div className="text-[11.5px] text-[#8C7F76]">{bk.time}</div>
              </div>
            </div>
          ))}
          <div className="border-t border-[#EFE6D9] pt-3.5 mt-1">
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 bg-[#E87E5B] text-white font-semibold text-[13px] px-4 py-2 rounded-[20px] hover:bg-[#d46e4b] transition-colors cursor-pointer"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
              Book new appointment
            </button>
          </div>
        </div>
      </div>

      {/* Salon pills */}
      <div className="flex gap-2.5 px-5 md:px-8 pb-8 overflow-x-auto scrollbar-none">
        {PREVIEW_BUSINESSES.map(b => (
          <div key={b.name} className="flex items-center gap-2 bg-white border border-[#EFE6D9] pl-1.5 pr-3 py-1.5 rounded-full shrink-0">
            <Monogram name={b.name} color={b.color} size={26} pill />
            <span className="text-xs font-semibold text-[#3E342E]">{b.name.split(' ')[0]}</span>
          </div>
        ))}
      </div>

    </div>
  )
}
