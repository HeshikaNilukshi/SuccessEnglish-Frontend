import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { fetchMyEnrollments } from '@/actions/courses'
import DashboardCourseCard from '@/components/DashboardCourseCard'
import ProfilePopover from '@/components/ui/ProfilePopover'
import PageShell from '@/components/teacher/PageShell'

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

  const firstName = user?.name ? user.name.split(' ')[0] : ''
  const pageTitle = (
    <>
      Welcome, <span className="gradient-text-accent">{firstName}</span>!
    </>
  )

  const breadcrumbs = [
    { label: 'Home' }
  ]

  return (
    <PageShell
      title={pageTitle}
      subtitle="Start your English journey."
      breadcrumbs={breadcrumbs}
      actions={<ProfilePopover />}
    >

      <main className="space-y-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
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
          <div className="flex flex-col gap-6 w-full animate-pulse">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl bg-bg-secondary/60 border border-border-subtle p-8 h-48 flex flex-col justify-between"
              >
                <div className="absolute inset-0 shimmer-overlay animate-shimmer" />
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-center gap-4 flex-grow">
                    <div className="w-14 h-14 rounded-2xl bg-black/5" />
                    <div className="space-y-2 flex-grow max-w-lg">
                      <div className="h-6 w-1/3 rounded bg-black/5" />
                      <div className="h-4 w-full rounded bg-black/5" />
                      <div className="h-4 w-3/4 rounded bg-black/5" />
                    </div>
                  </div>
                  <div className="h-7 w-28 rounded bg-black/5" />
                </div>
                <div className="pt-4 border-t border-border-subtle flex justify-between items-center">
                  <div className="h-4 w-28 rounded bg-black/5" />
                  <div className="h-4 w-24 rounded bg-black/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error Alert */}
        {!loading && error && (
          <div className="max-w-md mx-auto text-center p-8 rounded-2xl bg-red-500/12 border border-red-500/25 shadow-xl space-y-4">
            <div className="text-3xl">⚠️</div>
            <p className="text-sm text-red-900 font-medium">{error}</p>
            <button
              type="button"
              onClick={loadEnrollments}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Friendly Empty State */}
        {!loading && !error && enrollments.length === 0 && (
          <div className="max-w-xl mx-auto text-center py-16 px-8 rounded-2xl glass-panel border-border-subtle shadow-xl space-y-6 relative overflow-hidden group">
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/20 to-transparent" />

            <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-black/5 border border-border-subtle transition-transform duration-500 group-hover:scale-110">
              <span className="text-4xl">📚</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-indigo/10 to-accent-violet/10 rounded-2xl blur-md animate-pulse" />
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-text-primary tracking-tight">Your Course List is Empty</h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-md mx-auto">
                Find the perfect course for you and start learning today.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="/#courses"
                className="relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-text-primary overflow-hidden rounded-xl transition-all duration-300 active:scale-[0.98] hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] group/btn"
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
          <div className="flex flex-col gap-6 w-full">
            {enrollments.map((enrollment, idx) => (
              <DashboardCourseCard key={enrollment.id} enrollment={enrollment} index={idx} />
            ))}
          </div>
        )}
      </main>

    </PageShell>
  )
}
