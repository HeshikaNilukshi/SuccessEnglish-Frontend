import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchCourses } from '@/actions/courses'
import TeacherCourseCard from '@/components/TeacherCourseCard'
import ProfilePopover from '@/components/ui/ProfilePopover'

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

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-12">
      <header className="relative z-20 flex flex-col gap-4 mb-10 border-b border-border-subtle pb-6">
        <div>
          <Link
            to="/"
            className="text-xs text-text-muted hover:text-text-primary transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer"
          >
            &larr; Back to home portal
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-primary">
                Teacher Panel, <span className="gradient-text-accent">{user?.name}</span>
              </h1>
              <p className="text-text-secondary text-sm md:text-base">
                Manage your courses, content, and student exams.
              </p>
            </div>
            <ProfilePopover user={user} />
          </div>
        </div>
      </header>

      <main className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
            My Created Courses
          </h2>
          <div className="flex items-center gap-4">
            {!loading && courses.length > 0 && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/25">
                {courses.length} {courses.length === 1 ? 'Course' : 'Courses'}
              </span>
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
                className="relative overflow-hidden rounded-2xl bg-bg-secondary/60 border border-border-subtle p-7 h-[250px] flex flex-col justify-between animate-pulse"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-black/5" />
                  <div className="h-6 w-3/4 rounded bg-black/5" />
                  <div className="h-4 w-full rounded bg-black/5" />
                </div>
                <div className="pt-4 border-t border-border-subtle flex justify-between items-center">
                  <div className="h-3 w-1/3 rounded bg-black/5" />
                  <div className="h-3 w-1/4 rounded bg-black/5" />
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
          <div className="max-w-xl mx-auto text-center py-16 px-8 rounded-2xl glass-panel border-border-subtle shadow-xl space-y-6">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-black/5 border border-border-subtle">
              <span className="text-4xl">📚</span>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-text-primary tracking-tight">No Courses Created Yet</h3>
              <p className="text-sm text-text-secondary max-w-md mx-auto">
                Get started by creating your first course.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/teacher/courses/new"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all"
              >
                Create Course &rarr;
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <TeacherCourseCard key={course.id} course={course} index={idx} />
            ))}
          </div>
        )}
      </main>

    </div>
  )
}
