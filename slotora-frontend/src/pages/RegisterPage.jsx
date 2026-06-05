import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/api'

export default function RegisterPage() {
  const [name, setName] = useState('')
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
      const res = await api.post('/api/auth/register', { name, email, password })
      login({ name: res.data.name, email: res.data.email }, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError('Registration failed. Email may already be in use.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFAF4] flex items-center justify-center">
      <div className="bg-white rounded-[20px] shadow-md p-8 w-full max-w-md">
        <h1 className="font-['Bricolage_Grotesque'] text-3xl font-extrabold text-[#3E342E] mb-2">
          Create account
        </h1>
        <p className="text-[#8C7F76] mb-6">Book appointments with Slotora</p>

        {error && (
          <div className="bg-[#F7DCD2] text-[#B23C28] rounded-xl px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-[#3E342E] mb-1 block">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#EFE6D9] rounded-xl px-4 py-3 text-[#3E342E] outline-none focus:border-[#E87E5B]"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[#3E342E] mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#EFE6D9] rounded-xl px-4 py-3 text-[#3E342E] outline-none focus:border-[#E87E5B]"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[#3E342E] mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#EFE6D9] rounded-xl px-4 py-3 text-[#3E342E] outline-none focus:border-[#E87E5B]"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#E87E5B] text-white font-bold py-3 rounded-xl hover:bg-[#d46e4b] transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-[#8C7F76] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#E87E5B] font-semibold">Log in</Link>
        </p>
      </div>
    </div>
  )
}