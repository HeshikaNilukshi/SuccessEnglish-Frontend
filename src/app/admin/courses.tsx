import { useEffect, useState } from 'react'
import { fetchCourses } from '@/actions/courses'
import PageShell from '@/components/teacher/PageShell'
import { EmptyState } from '@/components/ui/EmptyState'
import CourseCard from '@/components/ui/CourseCard'

export default function AdminCoursesList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [coursesError, setCoursesError] = useState<string | null>(null)

  const loadCourses = async () => {
    setLoadingCourses(true)
    setCoursesError(null)
    try {
      const data = await fetchCourses()
      setCourses(data)
    } catch (err: any) {
      console.error(err)
      setCoursesError(err.message || 'Failed to load courses.')
    } finally {
      setLoadingCourses(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const pageTitle = (
    <>
      System <span className="gradient-text-accent">Courses</span>
    </>
  )

  const breadcrumbs = [
    { label: 'Home', href: '/admin' },
    { label: 'Courses' }
  ]

  return (
    <PageShell
      title={pageTitle}
      subtitle="View all courses registered in the platform."
      breadcrumbs={breadcrumbs}
    >
      <div className="flex-grow flex flex-col animate-fade-in-up">
        <div className="flex-grow flex flex-col">
          {loadingCourses && (
            <div className="flex justify-center items-center py-20 flex-grow">
              <div className="w-8 h-8 rounded-full border-2 border-accent-indigo border-t-transparent animate-spin" />
            </div>
          )}

          {!loadingCourses && coursesError && (
            <div className="max-w-md mx-auto text-center p-8 rounded-2xl bg-red-500/12 border border-red-500/25 shadow-xl space-y-4 my-auto">
              <p className="text-sm text-red-900 font-medium">{coursesError}</p>
              <button
                type="button"
                onClick={loadCourses}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}

          {!loadingCourses && !coursesError && courses.length === 0 && (
            <EmptyState
              icon="📚"
              title="No Courses Found"
              description="There are currently no courses registered in the platform."
            />
          )}

          {!loadingCourses && !coursesError && courses.length > 0 && (
            <div className="flex flex-col gap-5 w-full">
              {courses.map((course, idx) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  index={idx}
                  to={`/admin/courses/${course.id}`}
                  teacher={course.creator}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  )
}
