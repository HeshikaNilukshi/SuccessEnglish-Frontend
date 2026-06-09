import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchUserById, updateUser } from '@/actions/users'
import { formatDate } from '@/utils/format-datetime'

export default function UserProfile() {
  const { id } = useParams<{ id: string }>()
  const { token, user: currentUser } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [profileUser, setProfileUser] = useState<any>(null)

  // Edit form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadProfile = async () => {
    if (!token || !id) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchUserById(token, parseInt(id, 10))
      setProfileUser(data)
      setName(data.name || '')
      setEmail(data.email || '')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to load user profile.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [token, id])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !id) return
    if (!name.trim() || !email.trim()) {
      setError('Name and Email are required.')
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const payload: any = { name, email }
      if (password) payload.password = password

      const updated = await updateUser(token, parseInt(id, 10), payload)
      setProfileUser((prev: any) => ({ ...prev, ...updated }))
      setPassword('')
      setSuccess('Profile updated successfully.')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to update user details.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center relative text-text-primary overflow-hidden">
        <div className="absolute inset-0 radial-glow-main pointer-events-none z-0" />
        <div className="absolute inset-0 dot-pattern pointer-events-none z-0 opacity-50" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo via-accent-violet to-accent-pink opacity-90 animate-pulse" />
            <span className="relative text-white font-extrabold text-lg select-none">U</span>
          </div>
          <p className="text-sm font-semibold tracking-wider text-text-secondary animate-pulse uppercase">
            Loading Profile...
          </p>
        </div>
      </div>
    )
  }

  if (error && !profileUser) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center p-8 rounded-2xl bg-red-500/5 border border-red-500/10 shadow-xl space-y-4">
        <div className="text-3xl">⚠️</div>
        <p className="text-sm text-red-400">{error || 'User not found'}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
        >
          Go Back
        </button>
      </div>
    )
  }

  const isTeacher = profileUser.role === 'TEACHER'
  const isStudent = profileUser.role === 'STUDENT'
  const isAdminView = currentUser?.role === 'ADMIN'

  const backLink = isAdminView
    ? (isTeacher ? '/admin/teachers' : isStudent ? '/admin/students' : '/admin/admins')
    : -1

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 pt-10 pb-12">
      <header className="relative z-20 flex flex-col gap-4 mb-10 border-b border-white/[0.04] pb-6 animate-fade-in-up">
        <div>
          {typeof backLink === 'string' ? (
            <Link
              to={backLink}
              className="text-xs text-text-muted hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200">&larr;</span> Back
            </Link>
          ) : (
            <button
              onClick={() => navigate(-1)}
              className="text-xs text-text-muted hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer bg-transparent border-none outline-none"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200">&larr;</span> Back
            </button>
          )}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            User <span className="gradient-text-accent">Profile</span>
          </h1>
          <p className="text-text-secondary text-sm md:text-base mt-2">
            {isAdminView ? 'Manage user credentials and view system activity.' : 'View student details and enrollment status.'}
          </p>
        </div>
      </header>

      <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {/* User Information & Form Area */}
        <div className="relative overflow-hidden rounded-2xl glass-panel border border-white/[0.04] p-8 shadow-xl">
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/25 to-transparent" />

          {isAdminView ? (
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar & Side Meta */}
              <div className="flex flex-col items-center shrink-0 w-full md:w-48 text-center border-b md:border-b-0 md:border-r border-white/[0.04] pb-6 md:pb-0 md:pr-8">
                <div className="relative w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-accent-indigo via-accent-violet to-accent-pink shadow-[0_8px_32px_rgba(99,102,241,0.25)] mb-4">
                  <span className="text-white font-extrabold text-2xl uppercase">
                    {profileUser.name?.charAt(0) ?? 'U'}
                  </span>
                </div>
                <div className="space-y-1 text-center w-full">
                  <div className="text-[9px] uppercase tracking-wider text-text-muted">User ID</div>
                  <div className="font-mono text-xs text-text-secondary truncate max-w-full bg-white/[0.03] px-2 py-1 rounded">
                    {profileUser.id}
                  </div>
                  <span className="text-[9px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/25 mb-4">
                    {profileUser.role}
                  </span>
                </div>
                <div className="text-[10px] text-text-muted mt-4">
                  Registered: <span className="text-text-secondary font-medium">{formatDate(profileUser.createdAt || '')}</span>
                </div>
              </div>

              {/* Editable Form (Admin Only) */}
              <div className="flex-grow w-full">
                {error && (
                  <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 text-sm">
                    <span className="text-sm shrink-0">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-sm">
                    <span className="text-sm shrink-0">✓</span>
                    <span>{success}</span>
                  </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        className="auth-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        className="auth-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      Change Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Leave blank to keep current password"
                      className="auth-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="pt-4 border-t border-white/[0.04] flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="relative inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold text-white overflow-hidden rounded-xl transition-all duration-300 active:scale-[0.98] hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer group/btn"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-accent-indigo to-accent-violet" />
                      <span className="relative">
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              {/* Left side: Avatar */}
              <div className="relative w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-accent-indigo via-accent-violet to-accent-pink shadow-[0_8px_32px_rgba(99,102,241,0.25)] shrink-0">
                <span className="text-white font-extrabold text-3xl uppercase">
                  {profileUser.name?.charAt(0) ?? 'U'}
                </span>
              </div>

              {/* Right side: Details */}
              <div className="flex-grow text-center sm:text-left space-y-2.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {profileUser.name}
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2 sm:gap-4 text-sm sm:text-base text-text-secondary">
                  <span className="font-semibold text-white/90">{profileUser.email}</span>
                  <span className="hidden sm:inline text-white/10">•</span>
                  <span className="font-mono bg-white/[0.04] px-2.5 py-0.5 rounded text-xs text-text-secondary border border-white/[0.04] inline-block self-center">
                    Student ID: {profileUser.id}
                  </span>
                  <span className="hidden sm:inline text-white/10">•</span>
                  <span className="text-[9px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/25">
                    {profileUser.role}
                  </span>
                </div>
                <div className="text-xs text-text-muted">
                  Registered on <span className="text-text-secondary font-medium">{formatDate(profileUser.createdAt || '')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Courses Area (Shown Below Information) */}
        {isTeacher && (
          <div className="relative overflow-hidden rounded-2xl glass-panel border border-white/[0.04] p-8 shadow-xl">
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/25 to-transparent" />
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                📚 Created Courses
              </h3>
              {profileUser.createdCourses && profileUser.createdCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profileUser.createdCourses.map((course: any) => (
                    <Link
                      key={course.id}
                      to={isAdminView ? `/admin/courses/${course.id}` : `/teacher/${course.id}`}
                      className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 hover:-translate-y-0.5 active:scale-[0.98] transition-all group flex flex-col justify-between"
                    >
                      <h4 className="text-sm font-bold text-white group-hover:text-accent-indigo transition-colors duration-200">
                        {course.name}
                      </h4>
                      <div className="mt-4 flex items-center justify-between text-xs text-text-muted">
                        <span>Price: LKR {parseFloat(course.price).toLocaleString()}</span>
                        <span className="text-accent-indigo group-hover:text-white transition-colors duration-200">View &rarr;</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-secondary">This teacher has not created any courses yet.</p>
              )}
            </div>
          </div>
        )}

        {isStudent && (
          <div className="relative overflow-hidden rounded-2xl glass-panel border border-white/[0.04] p-8 shadow-xl">
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/25 to-transparent" />
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                📚 Enrolled Courses
              </h3>
              {profileUser.enrollments && profileUser.enrollments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profileUser.enrollments.map((enrollment: any) => (
                    <div
                      key={enrollment.id}
                      onClick={() => navigate(isAdminView ? `/admin/courses/${enrollment.course.id}` : `/teacher/${enrollment.course.id}`)}
                      className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 hover:-translate-y-0.5 active:scale-[0.98] transition-all group flex flex-col justify-between cursor-pointer text-left"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-accent-indigo transition-colors duration-200">
                          {enrollment.course.name}
                        </h4>
                        <span className={`inline-block mt-2 text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${enrollment.verified
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                          {enrollment.verified ? 'Verified' : 'Pending Verification'}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-[11px] text-text-muted">
                        <span>Enrolled on: {formatDate(enrollment.createdAt)}</span>
                        <div className="flex items-center gap-3">
                          {!isAdminView && enrollment.course.createdBy === currentUser?.id && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/teacher/${enrollment.course.id}/student/${profileUser.id}`)
                              }}
                              className="px-2 py-1 rounded bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/20 hover:bg-accent-indigo hover:text-white transition-all text-[10px] font-semibold cursor-pointer"
                            >
                              Results
                            </button>
                          )}
                          <span className="text-accent-indigo group-hover:text-white transition-colors duration-200">View &rarr;</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-secondary">This student is not enrolled in any courses yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
