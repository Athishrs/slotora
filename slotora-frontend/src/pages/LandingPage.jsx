import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#FDFAF4] flex flex-col">
      <nav className="px-8 py-5 flex items-center justify-between">
        <span className="font-['Bricolage_Grotesque'] text-2xl font-extrabold text-[#E87E5B]">
          Slotora
        </span>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-[#3E342E] px-4 py-2 rounded-xl hover:bg-[#EFE6D9] transition-colors"
          >
            Log in
          </button>
          <button
            onClick={() => navigate('/register')}
            className="text-sm font-bold bg-[#E87E5B] text-white px-4 py-2 rounded-xl hover:bg-[#d46e4b] transition-colors"
          >
            Get started
          </button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-['Bricolage_Grotesque'] text-5xl font-extrabold text-[#3E342E] mb-4 leading-tight">
          Book appointments,<br />effortlessly.
        </h1>
        <p className="text-[#8C7F76] text-lg mb-8 max-w-md">
          Slotora makes it easy to discover services and book appointments in seconds.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/register')}
            className="bg-[#E87E5B] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#d46e4b] transition-colors"
          >
            Get started for free
          </button>
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-[#3E342E] font-bold px-6 py-3 rounded-xl border border-[#EFE6D9] hover:bg-[#FAF5EE] transition-colors"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  )
}