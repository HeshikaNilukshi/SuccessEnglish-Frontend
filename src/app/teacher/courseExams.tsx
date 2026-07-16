import { useState, useEffect } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchCourse, fetchExamsByCourse } from '@/actions/courses'
import PageShell from '@/components/teacher/PageShell'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/EmptyState'

export default function TeacherCourseExams() {
  const { courseId } = useParams<{ courseId: string }>()
  const { token } = useAuth()
  const location = useLocation()
  const basePath = location.pathname.startsWith('/admin') ? '/admin/courses' : '/teacher'

  const [course, setCourse] = useState<Course | null>(null)
  const [exams, setExams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadContent = async () => {
      if (!courseId || !token) return
      try {
        setLoading(true)
        setError(null)
        const id = parseInt(courseId, 10)
        if (isNaN(id)) {
          throw new Error('Invalid Course ID')
        }

        const [courseData, examsData] = await Promise.all([
          fetchCourse(id, token),
          fetchExamsByCourse(token, id)
        ])

        setCourse(courseData)
        setExams(examsData)
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load exams.')
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [courseId, token])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-8">
        <header className="mb-6">
          <div className="h-4 w-32 bg-black/5 rounded mb-4 animate-pulse" />
          <div className="h-10 w-80 bg-black/5 rounded mb-3 animate-pulse" />
        </header>
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-black/5 rounded-2xl border border-border-subtle p-5 flex items-center justify-between animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="max-w-md mx-auto text-center p-12 mt-16 rounded-2xl bg-[#fbfbfa] border border-[#e2e8f0] shadow-sm space-y-6">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-900 font-medium text-3xl">
          ⚠️
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[#0f172a]">Error</h3>
          <p className="text-[#64748b] text-sm leading-relaxed">{error || 'Course exams unavailable.'}</p>
        </div>
        <Link
          to={`${basePath}/${courseId}`}
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-text-primary bg-[#f8fafc] border border-[#e2e8f0] hover:bg-slate-50 transition-all cursor-pointer"
        >
          Back to Course
        </Link>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Home', href: basePath },
    { label: course.name, href: `${basePath}/${course.id}` },
    { label: 'Exams' }
  ]

  const headerActions = (
    <Link
      to={`${basePath}/${course.id}/exams/new`}
      className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 transition-all shadow-sm shadow-violet-500/10 inline-block"
    >
      + Add Exam
    </Link>
  )

  return (
    <PageShell
      title={`${course.name} - Exams`}
      subtitle="Manage course examinations and assessments."
      breadcrumbs={breadcrumbs}
      actions={headerActions}
    >
      <div className="flex-grow flex flex-col">
        {exams.length === 0 ? (
          <EmptyState
            icon="✍️"
            title="No Exams Created"
            description="Create a course assessment using the Add Exam button above."
          />
        ) : (
          <div className="flex flex-col gap-4 animate-fade-in-up">
            {exams.map((exam) => (
              <Link
                key={exam.id}
                to={`${basePath}/${course.id}/exams/${exam.id}`}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl glass-panel glass-panel-hover p-5 text-left cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-x-1"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent-violet to-accent-pink rounded-l-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center gap-4 flex-grow">
                  <div className="w-12 h-12 rounded-xl bg-black/5 border border-border-subtle flex items-center justify-center text-xl shrink-0 group-hover:bg-accent-violet/10 group-hover:border-accent-violet/30 transition-all duration-300">
                    📝
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-base font-bold text-text-primary tracking-tight group-hover:text-accent-violet transition-colors duration-300">
                        {exam.title}
                      </h3>
                      <Badge variant="outline" className="text-[9px] font-mono text-text-muted border-border-subtle px-1.5 py-0.5 rounded-md">
                        {exam.duration > 0 ? `${exam.duration} mins` : 'Untimed'}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-text-muted font-medium">
                      Questions: {exam._count?.questions ?? 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/[0.04]">
                  <div className="text-xs font-bold text-accent-violet opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex items-center gap-1">
                    View Exam <span className="text-sm">&rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}
