import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { fetchUserById, updateUser } from '@/actions/users'
import { formatDate } from '@/lib/utils'
import PageShell from '@/components/teacher/PageShell'

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
      <div className="max-w-md mx-auto mt-20 text-center p-8 rounded-2xl bg-red-500/12 border border-red-500/25 shadow-xl space-y-4">
        <div className="text-3xl">⚠️</div>
        <p className="text-sm text-red-900 font-medium">{error || 'User not found'}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-xl text-xs font-semibold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
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
    <PageShell
      title={<>User <span className="text-accent-indigo">Profile</span></>}
      subtitle={isAdminView ? 'Manage user credentials and view system activity.' : 'View student details and enrollment status.'}
      homeHref={currentUser?.role === 'TEACHER' ? '/teacher' : currentUser?.role === 'ADMIN' ? '/admin' : '/student'}
      breadcrumbs={[
        { label: isAdminView ? (isTeacher ? 'Teachers' : isStudent ? 'Students' : 'Admins') : 'Students', href: typeof backLink === 'string' ? backLink : '/teacher' },
        { label: profileUser?.name || 'User Profile' }
      ]}
      maxWidthClass="max-w-7xl"
    >
      <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {/* User Information & Form Area */}
        <div className="relative overflow-hidden rounded-2xl bg-bg-secondary border border-border-subtle p-8 shadow-sm">

          {isAdminView ? (
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar & Side Meta */}
              <div className="flex flex-col items-center shrink-0 w-full md:w-48 text-center border-b md:border-b-0 md:border-r border-border-subtle pb-6 md:pb-0 md:pr-8">
                <div className="relative w-20 h-20 flex items-center justify-center rounded-2xl bg-accent-indigo/10 mb-4">
                  <span className="text-accent-indigo font-extrabold text-2xl uppercase">
                    {profileUser.name?.charAt(0) ?? 'U'}
                  </span>
                </div>
                <div className="space-y-1 text-center w-full">
                  <div className="text-[9px] uppercase tracking-wider text-text-muted">User ID</div>
                  <div className="font-mono text-xs text-text-secondary truncate max-w-full bg-black/5 px-2 py-1 rounded">
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
                  <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-500/12 border border-red-500/25 text-red-900 font-medium text-sm">
                    <span className="text-sm shrink-0">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-emerald-500/12 border border-emerald-500/25 text-emerald-900 font-medium text-sm">
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
                    <PasswordInput
                      id="password"
                      placeholder="Leave blank to keep current password"
                      className="auth-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="pt-4 border-t border-border-subtle flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="relative inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold text-text-primary overflow-hidden rounded-xl transition-all duration-300 active:scale-[0.98] hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer group/btn"
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
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-between w-full">
              <div className="flex flex-col sm:flex-row gap-6 items-center text-center sm:text-left">
                {/* Left side: Avatar */}
                <div className="relative w-20 h-20 flex items-center justify-center rounded-2xl bg-accent-indigo/10 shrink-0 mx-auto sm:mx-0">
                  <span className="text-accent-indigo font-extrabold text-3xl uppercase">
                    {profileUser.name?.charAt(0) ?? 'U'}
                  </span>
                </div>

                {/* Right side: Details */}
                <div className="space-y-2.5">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                    {profileUser.name}
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2 sm:gap-4 text-sm sm:text-base text-text-secondary">
                    <span className="font-semibold text-text-primary/90">{profileUser.email}</span>
                    <span className="hidden sm:inline text-text-primary/10">•</span>
                    <span className="font-mono bg-black/5 px-2.5 py-0.5 rounded text-xs text-text-secondary border border-border-subtle inline-block self-center">
                      Student ID: {profileUser.id}
                    </span>
                    <span className="hidden sm:inline text-text-primary/10">•</span>
                    <span className="text-[9px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/25">
                      {profileUser.role}
                    </span>
                  </div>
                  <div className="text-xs text-text-muted">
                    Registered on <span className="text-text-secondary font-medium">{formatDate(profileUser.createdAt || '')}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {currentUser?.role === 'TEACHER' && isStudent && (
                <Link
                  to={`/teacher/student/${profileUser.id}/results`}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-text-primary bg-accent-indigo/10 border border-accent-indigo/20 hover:bg-accent-indigo hover:text-white transition-all duration-200 cursor-pointer shadow-sm shrink-0 flex items-center gap-1.5"
                >
                  📈 View Progress Timeline
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Courses Area (Shown Below Information) */}
        {isTeacher && (
          <div className="relative overflow-hidden rounded-2xl bg-bg-secondary border border-border-subtle p-8 shadow-sm">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-text-primary tracking-tight flex items-center gap-2">
                📚 Created Courses
              </h3>
              {profileUser.createdCourses && profileUser.createdCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profileUser.createdCourses.map((course: any) => (
                    <Link
                      key={course.id}
                      to={isAdminView ? `/admin/courses/${course.id}` : `/teacher/${course.id}`}
                      className="p-5 rounded-xl bg-black/5 border border-border-subtle hover:bg-black/5 hover:border-border-subtle hover:-translate-y-0.5 active:scale-[0.98] transition-all group flex flex-col justify-between"
                    >
                      <h4 className="text-sm font-bold text-text-primary group-hover:text-accent-indigo transition-colors duration-200">
                        {course.name}
                      </h4>
                      <div className="mt-4 flex items-center justify-between text-xs text-text-muted">
                        <span>Price: LKR {parseFloat(course.price).toLocaleString()}</span>
                        <span className="text-accent-indigo group-hover:text-text-primary transition-colors duration-200">View &rarr;</span>
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
          <div className="relative overflow-hidden rounded-2xl bg-bg-secondary border border-border-subtle p-8 shadow-sm">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-text-primary tracking-tight flex items-center gap-2">
                📚 Enrolled Courses
              </h3>
              {profileUser.enrollments && profileUser.enrollments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profileUser.enrollments.map((enrollment: any) => (
                    <div
                      key={enrollment.id}
                      onClick={() => navigate(isAdminView ? `/admin/courses/${enrollment.course.id}` : `/teacher/${enrollment.course.id}`)}
                      className="p-5 rounded-xl bg-black/5 border border-border-subtle hover:bg-black/5 hover:border-border-subtle hover:-translate-y-0.5 active:scale-[0.98] transition-all group flex flex-col justify-between cursor-pointer text-left"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-text-primary group-hover:text-accent-indigo transition-colors duration-200">
                          {enrollment.course.name}
                        </h4>
                        <span className={`inline-block mt-2 text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${enrollment.verified
                          ? 'bg-emerald-500/10 text-emerald-900 font-medium border border-emerald-500/20'
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
                          <span className="text-accent-indigo group-hover:text-text-primary transition-colors duration-200">View &rarr;</span>
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
    </PageShell>
  )
}
