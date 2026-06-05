import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/api'
import { Icon } from '../components/ui'

const SALON_INITIALS = ['PG', 'TD', 'BP', 'WW']

function BrandPanel({ heading }) {
  return (
    <div className="relative flex flex-col justify-between p-10 overflow-hidden"
      style={{ background: 'linear-gradient(150deg, #E87E5B 0%, #F9A869 100%)' }}>
      <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: 999, background: 'rgba(255,255,255,0.08)', top: -90, right: -80 }} />
      <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: 999, background: 'rgba(255,255,255,0.06)', bottom: -60, left: -50 }} />
      <div className="flex items-center gap-2.5 relative z-10">
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.18)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16 }}>S</div>
        <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 19, color: '#fff' }}>Slotora</span>
      </div>
      <div className="relative z-10">
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 30, lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', margin: '0 0 12px' }}>
          {heading}
        </h2>
        <p className="text-[14.5px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.82)', maxWidth: 300, margin: 0 }}>
          One account books grooming across every salon — see upcoming visits, notes, and history in one place.
        </p>
      </div>
      <div className="flex gap-2.5 relative z-10">
        {SALON_INITIALS.map(s => (
          <div key={s} style={{ width: 36, height: 36, borderRadius: 999, background: 'rgba(255,255,255,0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
            {s}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/api/auth/login', { email, password })
      login({ name: res.data.name, email: res.data.email }, res.data.token)
      navigate('/dashboard')
    } catch {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:grid md:grid-cols-2" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>

      {/* Brand panel — full height on desktop, compact strip on mobile */}
      <div className="md:block">
        <div className="hidden md:flex h-full">
          <BrandPanel heading="Your pups are waiting." />
        </div>
        {/* Mobile brand strip */}
        <div className="md:hidden flex flex-col items-center pt-10 pb-6 px-6"
          style={{ background: 'linear-gradient(150deg, #E87E5B 0%, #F9A869 100%)' }}>
          <div style={{ width: 54, height: 54, borderRadius: 16, background: 'rgba(255,255,255,0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 28, fontFamily: "'Bricolage Grotesque', sans-serif", marginBottom: 12 }}>S</div>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 24, color: '#fff', margin: 0 }}>Welcome back</h1>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 14, marginTop: 6, textAlign: 'center' }}>Log in to manage your bookings</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="bg-[#FDFAF4] flex flex-col justify-center px-6 md:px-12 py-8 md:py-12">
        <button
          onClick={() => navigate('/')}
          className="self-start flex items-center gap-1.5 text-[13px] font-semibold text-[#8C7F76] hover:text-[#3E342E] transition-colors mb-6 cursor-pointer"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", background: 'none', border: 'none', padding: 0 }}>
          <Icon name="arrowLeft" size={15} color="currentColor" />
          Back
        </button>
        <h1 className="hidden md:block" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 27, fontWeight: 800, letterSpacing: '-0.02em', color: '#3E342E', margin: '0 0 6px' }}>
          Welcome back
        </h1>
        <p className="hidden md:block text-[13.5px] text-[#8C7F76] mb-7">Log in to manage your grooming appointments.</p>

        {error && (
          <div className="bg-[#F7DCD2] text-[#B23C28] rounded-xl px-4 py-3 mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[12.5px] font-semibold text-[#3E342E] mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required
              className="w-full bg-white border border-[#EFE6D9] rounded-[20px] px-4 py-3 text-[13.5px] text-[#3E342E] outline-none focus:border-[#E87E5B] transition-colors"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif" }} />
          </div>
          <div>
            <label className="block text-[12.5px] font-semibold text-[#3E342E] mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
              className="w-full bg-white border border-[#EFE6D9] rounded-[20px] px-4 py-3 text-[13.5px] text-[#3E342E] outline-none focus:border-[#E87E5B] transition-colors"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif" }} />
          </div>
          <div className="flex justify-end">
            <span className="text-[13px] text-[#E87E5B] font-semibold cursor-pointer">Forgot password?</span>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#E87E5B] text-white font-bold py-3.5 rounded-[20px] hover:bg-[#d46e4b] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-1 cursor-pointer"
            style={{ fontSize: 14.5, fontFamily: "'Hanken Grotesk', sans-serif" }}>
            {loading ? 'Logging in…' : <><span>Log in</span><Icon name="arrow" size={17} color="#fff" /></>}
          </button>
        </form>

        <p className="text-[13px] text-[#8C7F76] text-center mt-6">
          New to Slotora?{' '}
          <Link to="/register" className="text-[#E87E5B] font-bold" style={{ textDecoration: 'none' }}>Create an account</Link>
        </p>
      </div>

    </div>
  )
}
