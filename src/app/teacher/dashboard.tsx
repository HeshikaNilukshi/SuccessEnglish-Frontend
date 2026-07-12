import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchCourses } from '@/actions/courses'
import TeacherCourseCard from '@/components/TeacherCourseCard'
import ProfilePopover from '@/components/ui/ProfilePopover'
import PageShell from '@/components/teacher/PageShell'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/EmptyState'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const pageTitle = (
    <>
      Teacher Panel, <span className="gradient-text-accent">{user?.name}</span>
    </>
  )

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Home' },
  ]

  return (
    <PageShell
      title={pageTitle}
      subtitle="Manage your courses, content, and student exams."
      breadcrumbs={breadcrumbs}
      actions={<ProfilePopover user={user} />}
    >
      <div className="flex-grow flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
            My Created Courses
          </h2>
          <div className="flex items-center gap-4">
            {!loading && courses.length > 0 && (
              <Badge variant="outline" className="font-semibold px-2.5 py-1 bg-accent-indigo/10 text-accent-indigo border-accent-indigo/25">
                {courses.length} {courses.length === 1 ? 'Course' : 'Courses'}
              </Badge>
            )}
            <Link
              to="/teacher/courses/new"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all"
            >
              + Create Course
            </Link>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl bg-bg-secondary/60 border border-border-subtle p-7 h-[250px] flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <Skeleton className="h-6 w-3/4 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                </div>
                <div className="pt-4 border-t border-border-subtle flex justify-between items-center">
                  <Skeleton className="h-3 w-1/3 rounded" />
                  <Skeleton className="h-3 w-1/4 rounded" />
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
              <Link
                to="/teacher/courses/new"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all"
              >
                Create Course &rarr;
              </Link>
            }
          />
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <TeacherCourseCard key={course.id} course={course} index={idx} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}
