import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { fetchMyEnrollments } from '@/actions/courses'
import DashboardCourseCard from '@/components/DashboardCourseCard'
import ProfilePopover from '@/components/ui/ProfilePopover'

export default function StudentDashboard() {
  const { user, token } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadEnrollments = async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchMyEnrollments(token)
      setEnrollments(data)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to load your courses. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEnrollments()
  }, [token])

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16">
      {/* ── Dashboard Header ── */}
      <header className="relative z-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-16 border-b border-white/[0.04] pb-8 animate-fade-in-up">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            Welcome, <span className="gradient-text-accent">{user?.name}</span>!
          </h1>
          <p className="text-text-secondary text-sm md:text-base">
            Start your English journey.
          </p>
        </div>

        <ProfilePopover user={user} />
      </header>

      {/* ── Main Section ── */}
      <main className="space-y-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            My Courses
          </h2>
          {!loading && enrollments.length > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/25">
              {enrollments.length} {enrollments.length === 1 ? 'Course' : 'Courses'}
            </span>
          )}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl bg-bg-secondary/60 border border-white/[0.04] p-7 h-[250px] flex flex-col justify-between"
              >
                <div className="absolute inset-0 shimmer-overlay animate-shimmer" />
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse" />
                  <div className="h-6 w-3/4 rounded bg-white/5 animate-pulse" />
                  <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
                  <div className="h-4 w-5/6 rounded bg-white/5 animate-pulse" />
                </div>
                <div className="pt-4 border-t border-white/[0.04] flex justify-between items-center">
                  <div className="h-3 w-1/3 rounded bg-white/5 animate-pulse" />
                  <div className="h-3 w-1/4 rounded bg-white/5 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error Alert */}
        {!loading && error && (
          <div className="max-w-md mx-auto text-center p-8 rounded-2xl bg-red-500/5 border border-red-500/10 shadow-xl space-y-4">
            <div className="text-3xl">⚠️</div>
            <p className="text-sm text-red-400">{error}</p>
            <button
              type="button"
              onClick={loadEnrollments}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Friendly Empty State */}
        {!loading && !error && enrollments.length === 0 && (
          <div className="max-w-xl mx-auto text-center py-16 px-8 rounded-2xl glass-panel border-white/[0.04] shadow-xl space-y-6 relative overflow-hidden group">
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/20 to-transparent" />

            <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/10 transition-transform duration-500 group-hover:scale-110">
              <span className="text-4xl">📚</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-indigo/10 to-accent-violet/10 rounded-2xl blur-md animate-pulse" />
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white tracking-tight">Your Course List is Empty</h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-md mx-auto">
                Find the perfect course for you and start learning today.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="/#courses"
                className="relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white overflow-hidden rounded-xl transition-all duration-300 active:scale-[0.98] hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] group/btn"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-accent-indigo to-accent-violet" />
                <span className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.15)_50%,transparent_60%)] bg-[length:200%_100%]" />
                <span className="relative flex items-center gap-1.5">
                  View Courses →
                </span>
              </a>
            </div>
          </div>
        )}

        {/* Active Enrollment Cards */}
        {!loading && !error && enrollments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrollments.map((enrollment, idx) => (
              <DashboardCourseCard key={enrollment.id} enrollment={enrollment} index={idx} />
            ))}
          </div>
        )}
      </main>

      {/* Footer link back to homepage */}
      {/* <footer className="mt-20 pt-8 border-t border-white/[0.04] text-center">
        <a
          href="/"
          className="text-xs text-text-muted hover:text-white transition-colors duration-200 inline-flex items-center gap-1"
        >
          <span>&larr;</span> Back to home portal
        </a>
      </footer> */}
    </div>
  )
}
