import { useState, useEffect } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { createUser, fetchUserById, updateUser } from '@/actions/users'
import { PasswordInput } from '@/components/ui/PasswordInput'
import PageShell from '@/components/teacher/PageShell'
import { formatDate } from '@/lib/utils'

interface AdminUserFormProps {
  role?: 'ADMIN' | 'TEACHER' | 'STUDENT'
}

export default function AdminUserForm({ role }: AdminUserFormProps) {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { token } = useAuth()
  const isEdit = !!id

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileUser, setProfileUser] = useState<any>(null)
  const [loading, setLoading] = useState(isEdit)
  const [detectedRole, setDetectedRole] = useState<'ADMIN' | 'TEACHER' | 'STUDENT' | null>(role || null)

  useEffect(() => {
    if (!isEdit || !id || !token) return
    const loadUser = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchUserById(token, parseInt(id, 10))
        setProfileUser(data)
        setName(data.name || '')
        setEmail(data.email || '')
        setDetectedRole(data.role as 'ADMIN' | 'TEACHER' | 'STUDENT')
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load user profile.')
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [id, token, isEdit])

  const activeRole = detectedRole || 'STUDENT'

  const roleLabels = {
    ADMIN: { title: 'Admin', path: 'admins' },
    TEACHER: { title: 'Teacher', path: 'teachers' },
    STUDENT: { title: 'Student', path: 'students' },
  }

  const { title, path } = roleLabels[activeRole]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || (!isEdit && !password.trim())) {
      setError('Please fill in all required fields.')
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      if (isEdit) {
        const payload: any = { name, email }
        if (password) payload.password = password
        const updated = await updateUser(token!, parseInt(id!, 10), payload)
        setProfileUser((prev: any) => ({ ...prev, ...updated }))
        setPassword('')
        setSuccess('Profile updated successfully.')
      } else {
        await createUser(token!, { name, email, password, role: activeRole })
        navigate(`/admin/${path}`)
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An error occurred while saving.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const pageTitle = isEdit ? (
    <>
      Edit <span className="gradient-text-accent">{profileUser?.name || title}</span>
    </>
  ) : (
    <>
      Add <span className="gradient-text-accent">{title}</span>
    </>
  )

  const breadcrumbs = [
    { label: 'Home', href: '/admin' },
    { label: `Manage ${title}s`, href: `/admin/${path}` },
    { label: isEdit ? `Edit User` : `Add ${title}` }
  ]

  return (
    <PageShell
      title={pageTitle}
      subtitle={isEdit ? `Update account settings and profile details.` : `Create a new ${title.toLowerCase()} account.`}
      breadcrumbs={breadcrumbs}
      maxWidthClass="max-w-7xl"
    >
      {loading ? (
        <div className="flex justify-center items-center py-20 flex-grow">
          <div className="w-8 h-8 rounded-full border-2 border-accent-indigo border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          
          {/* Left Side Info Card */}
          <div className="hidden lg:flex lg:col-span-4">
            <div className="relative overflow-hidden rounded-2xl bg-bg-secondary border border-border-subtle p-8 shadow-sm text-center group w-full h-full flex flex-col justify-center items-center">
              <div className="flex flex-col items-center my-auto">
                
                {isEdit && profileUser ? (
                  // Edit Mode Card - Matches profile.tsx
                  <>
                    <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-3xl bg-accent-indigo/10">
                      <span className="text-accent-indigo font-extrabold text-3xl uppercase">
                        {profileUser.name?.charAt(0) ?? 'U'}
                      </span>
                    </div>

                    <div className="space-y-3 w-full">
                      <h2 className="text-2xl font-bold text-text-primary tracking-tight">{profileUser.name}</h2>

                      <div className="space-y-1">
                        <div className="text-[10px] uppercase tracking-wider text-text-muted">
                          User ID
                        </div>
                        <div className="font-mono text-sm font-semibold text-text-primary bg-black/5 border border-border-subtle px-3.5 py-1.5 rounded-xl select-all inline-block max-w-full truncate">
                          {profileUser.id}
                        </div>
                      </div>

                      <div className="text-xs text-text-secondary truncate max-w-full px-2">
                        {profileUser.email}
                      </div>

                      <div className="text-xs text-text-muted">
                        Joined on <span className="text-text-secondary font-medium">{formatDate(profileUser.createdAt || '')}</span>
                      </div>

                      <div className="pt-2 flex justify-center">
                        <span className="text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/25">
                          {profileUser.role} ROLE
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  // Create Mode Card
                  <>
                    <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-3xl bg-accent-indigo/10">
                      <span className="text-accent-indigo font-extrabold text-4xl">
                        {activeRole === 'ADMIN' ? '🛡️' : activeRole === 'TEACHER' ? '👨‍🏫' : '🎓'}
                      </span>
                    </div>

                    <div className="space-y-3 w-full">
                      <h2 className="text-2xl font-bold text-text-primary tracking-tight">New {title}</h2>

                      <p className="text-xs text-text-secondary leading-relaxed px-2">
                        {activeRole === 'ADMIN' 
                          ? 'Assign access to manage platform configurations, courses, system settings, and user lists.' 
                          : activeRole === 'TEACHER' 
                          ? 'Assign access to manage course contents, uploads, lectures, exam creation, and grading.' 
                          : 'Register a student account to allow enrollment, viewing lectures, and taking exams.'
                        }
                      </p>

                      <div className="pt-4 flex justify-center">
                        <span className="text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/25">
                          {activeRole} ROLE
                        </span>
                      </div>
                    </div>
                  </>
                )}
                
              </div>
            </div>
          </div>

          {/* Right Side Form Card */}
          <div className="lg:col-span-8">
            <div className="relative overflow-hidden rounded-2xl bg-bg-secondary border border-border-subtle p-8 shadow-sm h-full flex flex-col">
              
              {error && (
                <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-500/12 border border-red-500/25 text-red-900 font-medium text-sm animate-fade-in-up">
                  <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-emerald-500/12 border border-emerald-500/25 text-emerald-900 font-medium text-sm animate-fade-in-up">
                  <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8 flex-grow flex flex-col justify-between">
                <div className="space-y-8">
                  
                  {/* Section 1: Account Credentials */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-text-primary tracking-tight flex items-center gap-2">
                        <svg className="w-4 h-4 text-accent-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Account Credentials
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-xs font-semibold text-text-secondary">
                          Full Name <span className="text-red-900 font-medium">*</span>
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
                        <label htmlFor="email" className="block text-xs font-semibold text-text-secondary">
                          Email Address <span className="text-red-900 font-medium">*</span>
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
                    </div>
                  </div>

                  <div className="h-px bg-black/5" />

                  {/* Section 2: Security Settings */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-text-primary tracking-tight flex items-center gap-2">
                        <svg className="w-4 h-4 text-accent-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Security Settings
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="password" className="block text-xs font-semibold text-text-secondary">
                          Password {!isEdit && <span className="text-red-900 font-medium">*</span>}
                        </label>
                        <PasswordInput
                          id="password"
                          placeholder={isEdit ? 'Leave blank to keep current password' : 'Enter secure password'}
                          required={!isEdit}
                          className="auth-input"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-4 mt-8 border-t border-border-subtle flex items-center justify-end gap-4">
                  <Link
                    to={`/admin/${path}`}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold text-white overflow-hidden rounded-xl transition-all duration-300 active:scale-[0.98] hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer group/btn"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-accent-indigo to-accent-violet" />
                    <span className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.15)_50%,transparent_60%)] bg-[length:200%_100%]" />
                    <span className="relative flex items-center gap-1.5">
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Saving...
                        </>
                      ) : (
                        isEdit ? 'Save Changes' : `Save ${title}`
                      )}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  )
}
