import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchCourse, fetchExamsByCourse } from '@/actions/courses'
import PageShell from '@/components/teacher/PageShell'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/EmptyState'

export default function TeacherCourseExams() {
  const { courseId } = useParams<{ courseId: string }>()
  const { token } = useAuth()

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-[#fbfbfa] border border-[#e2e8f0] rounded-xl p-5 flex flex-col justify-between animate-pulse" />
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
          to={`/teacher/${courseId}`}
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-text-primary bg-[#f8fafc] border border-[#e2e8f0] hover:bg-slate-50 transition-all cursor-pointer"
        >
          Back to Course
        </Link>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Home', href: '/teacher' },
    { label: course.name, href: `/teacher/${course.id}` },
    { label: 'Exams' }
  ]

  const headerActions = (
    <Link
      to={`/teacher/${course.id}/exams/new`}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <Link
                key={exam.id}
                to={`/teacher/${course.id}/exams/${exam.id}`}
                className="group relative flex flex-col justify-between rounded-2xl bg-[#fbfbfa] border border-[#e2e8f0] p-6 min-h-[140px] text-left cursor-pointer hover:border-violet-500/50 hover:shadow-md transition-all duration-300"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-violet-600 rounded-t-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center text-lg group-hover:scale-105 transition-all duration-300">
                      📝
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono text-[#64748b] border-[#e2e8f0] px-1.5 py-0.5 rounded-md">
                      {exam.duration > 0 ? `${exam.duration} mins` : 'Untimed'}
                    </Badge>
                  </div>
                  
                  <h3 className="text-base font-bold text-[#0f172a] tracking-tight group-hover:text-violet-600 transition-colors duration-300 line-clamp-1">
                    {exam.title}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[11px] font-bold text-[#94a3b8]">
                  <span>Questions: {exam._count?.questions ?? 0}</span>
                  <div
                    className="text-violet-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5"
                  >
                    View Exam &rarr;
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
