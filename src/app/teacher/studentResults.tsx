import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchStudentResultsByCourse, type StudentAttemptResponse } from '@/actions/courses'
import PageShell from '@/components/teacher/PageShell'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDate } from '@/lib/utils'

export default function StudentSpecificResults() {
  const navigate = useNavigate()
  const { courseId, studentId } = useParams<{ courseId: string; studentId: string }>()
  const { token } = useAuth()

  const [attempts, setAttempts] = useState<StudentAttemptResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadResults = async () => {
      if (!courseId || !studentId || !token) return
      try {
        setLoading(true)
        setError(null)
        const cId = parseInt(courseId, 10)
        const sId = parseInt(studentId, 10)
        if (isNaN(cId) || isNaN(sId)) {
          throw new Error('Invalid Parameters')
        }

        const data = await fetchStudentResultsByCourse(token, cId, sId)
        setAttempts(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load student results.')
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [courseId, studentId, token])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 flex flex-col items-stretch">
        <div className="h-4 w-32 bg-black/5 rounded mb-4 animate-pulse" />
        <div className="h-10 w-80 bg-black/5 rounded mb-10 animate-pulse" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-black/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center p-12 mt-16 rounded-2xl glass-panel border-border-subtle shadow-xl space-y-6">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-900 font-medium text-3xl">
          ⚠️
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-text-primary">Error</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{error}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/teacher/${courseId}/students`)}
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
        >
          Back to Students
        </button>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Home', href: '/teacher' },
    { label: 'Course', href: `/teacher/${courseId}` },
    { label: 'Students', href: `/teacher/${courseId}/students` },
    { label: 'Attempts' }
  ]

  return (
    <PageShell
      title="Student Exam Attempts"
      subtitle="Detailed list of exam results for this specific student."
      breadcrumbs={breadcrumbs}
    >
      <div className="w-full max-w-7xl mx-auto">
        <main>
          {attempts.length === 0 ? (
            <EmptyState
              icon="📝"
              title="No Attempts Yet"
              description="This student has not attempted any exams for this course yet."
            />
          ) : (
            <div className="glass-panel rounded-2xl border border-border-subtle overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle bg-black/5">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Exam Title</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Date Taken</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {attempts.map((attempt) => (
                    <tr
                      key={attempt.id}
                      onClick={() => navigate(`/teacher/attempt/${attempt.id}`)}
                      className="hover:bg-black/5 transition-colors duration-150 cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-text-primary">{attempt.exam.title}</td>
                      <td className="px-6 py-4 text-sm text-text-muted">
                        {formatDate(attempt.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Badge
                          variant={attempt.isGraded ? "outline" : "secondary"}
                          className={`font-semibold ${
                            !attempt.isGraded
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900 font-medium'
                          }`}
                        >
                          {!attempt.isGraded ? 'Pending Grading' : `${attempt.score} Marks`}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </PageShell>
  )
}
