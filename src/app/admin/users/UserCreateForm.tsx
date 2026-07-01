import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { createUser } from '@/actions/users'

interface UserCreateFormProps {
  role: 'ADMIN' | 'TEACHER' | 'STUDENT'
}

export default function UserCreateForm({ role }: UserCreateFormProps) {
  const navigate = useNavigate()
  const { token } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const roleLabels = {
    ADMIN: { title: 'Admin', path: 'admins' },
    TEACHER: { title: 'Teacher', path: 'teachers' },
    STUDENT: { title: 'Student', path: 'students' },
  }

  const { title, path } = roleLabels[role]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await createUser(token!, { name, email, password, role })
      navigate(`/admin/${path}`)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An error occurred while saving.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-12 pt-10 pb-12">
      <header className="relative z-20 flex flex-col gap-4 mb-10 border-b border-border-subtle pb-6 animate-fade-in-up">
        <div>
          <Link
            to={`/admin/${path}`}
            className="text-xs text-text-muted hover:text-text-primary transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer"
          >
            &larr; Back to {title}s
          </Link>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-primary">
            Add <span className="gradient-text-accent">{title}</span>
          </h1>
        </div>
      </header>

      <main className="animate-fade-in-up animate-delay-100">
        <div className="relative overflow-hidden rounded-2xl glass-panel border border-border-subtle p-8 shadow-xl">
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/25 to-transparent" />
          
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 text-sm">
              <span className="text-sm shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder={`e.g. John ${title}`}
                className="auth-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="name@example.com"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Password <span className="text-red-400">*</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="Min. 6 characters"
                required
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="pt-4 border-t border-border-subtle flex items-center justify-end gap-4">
              <Link
                to={`/admin/${path}`}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold text-text-primary overflow-hidden rounded-xl transition-all duration-300 active:scale-[0.98] hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer group/btn"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-accent-indigo to-accent-violet" />
                <span className="relative">
                  {isSubmitting ? 'Saving...' : `Save ${title}`}
                </span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
