import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { fetchCourses } from '@/actions/courses'
import CourseCard from '@/components/ui/CourseCard'
import PageShell from '@/components/teacher/PageShell'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { CreateCourseModal } from '@/components/ui/CreateCourseModal'
import ProfilePopover from '@/components/ui/ProfilePopover'

export default function TeacherDashboard() {
  const { user, token } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false)

  const loadCourses = async () => {
    setLoading(true)
    setError(null)
    try {
      const allCourses = await fetchCourses()
      const teacherCourses = allCourses.filter(c => c.createdBy === user?.id)
      setCourses(teacherCourses)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to load courses.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [user])

  const firstName = user?.name ? user.name.split(' ')[0] : ''
  const pageTitle = (
    <>
      Welcome! <span className="gradient-text-accent">{firstName}</span>
    </>
  )

  const breadcrumbs = [
    { label: 'Home' },
  ]

  return (
    <PageShell
      title={pageTitle}
      subtitle="Manage your courses, content, and student exams."
      breadcrumbs={breadcrumbs}
      actions={<ProfilePopover />}
    >
      <div className="flex-grow flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
            My Courses
          </h2>
          <button
            onClick={() => setIsCreateCourseOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all cursor-pointer"
          >
            + Create Course
          </button>
        </div>

        {loading && (
          <div className="flex flex-col gap-5 w-full">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl bg-bg-secondary/60 border border-border-subtle p-6 h-28 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-5 flex-grow">
                  <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
                  <div className="space-y-2 flex-grow max-w-xl">
                    <Skeleton className="h-5 w-1/3 rounded" />
                    <Skeleton className="h-4 w-full rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="space-y-1.5 flex flex-col items-end">
                    <Skeleton className="h-3 w-16 rounded" />
                    <Skeleton className="h-4 w-20 rounded" />
                  </div>
                  <Skeleton className="w-10 h-10 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="max-w-md mx-auto text-center p-8 rounded-2xl bg-red-500/12 border border-red-500/25 space-y-4">
            <p className="text-sm text-red-900 font-medium">{error}</p>
            <button
              type="button"
              onClick={loadCourses}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <EmptyState
            icon="📚"
            title="No Courses Created Yet"
            description="Get started by creating your first course."
            action={
              <button
                onClick={() => setIsCreateCourseOpen(true)}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all cursor-pointer"
              >
                Create Course &rarr;
              </button>
            }
          />
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="flex flex-col gap-5 w-full">
            {courses.map((course, idx) => (
              <CourseCard key={course.id} course={course} index={idx} to={`/teacher/${course.id}`} />
            ))}
          </div>
        )}
      </div>

      <CreateCourseModal
        isOpen={isCreateCourseOpen}
        onClose={() => setIsCreateCourseOpen(false)}
        token={token ?? ''}
        onSuccess={loadCourses}
      />
    </PageShell>
  )
}
