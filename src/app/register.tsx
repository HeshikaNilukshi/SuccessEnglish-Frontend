import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function RegisterPage() {
  const { user, register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/student')
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await register({ name, email, password })
      navigate('/student')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-bg-primary text-text-primary px-4 selection:bg-accent-indigo/30 overflow-hidden py-12">
      <div className="absolute inset-0 radial-glow-main pointer-events-none z-0" />
      <div className="absolute inset-0 dot-pattern pointer-events-none z-0 opacity-50" />
      <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-accent-indigo/8 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-accent-violet/6 rounded-full blur-[160px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.25)]">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo via-accent-violet to-accent-pink opacity-90" />
              <span className="relative text-white font-extrabold text-lg tracking-tight select-none">S</span>
              <span className="absolute top-0.5 left-1 w-3.5 h-1 bg-white/25 rounded-full blur-[2px]" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white/90">
              Success <span className="gradient-text-accent font-extrabold">English</span>
            </span>
          </Link>
        </div>

        <div className="glass-panel rounded-2xl p-8 border border-white/[0.06] shadow-card relative overflow-hidden group">
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/35 to-transparent" />
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Create Account</h1>
            <p className="text-sm text-text-secondary">Join Sri Lanka's premium English language academy.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5 animate-pulse-slow">
              <span className="text-sm shrink-0">⚠️</span>
              <p className="leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="auth-input"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-input"
                required
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none hover:shadow-[0_0_25px_rgba(99,102,241,0.35)] cursor-pointer mt-2"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-accent-indigo to-accent-violet" />
              <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.15)_50%,transparent_60%)] bg-[length:200%_100%]" />
              <span className="relative flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-text-secondary">
            Already have an account?{' '}
            <Link to="/signin" className="font-semibold text-accent-indigo hover:text-accent-violet transition-colors duration-200">
              Sign In
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-text-muted hover:text-white transition-colors duration-200 flex items-center justify-center gap-1.5">
            <span>←</span> Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
