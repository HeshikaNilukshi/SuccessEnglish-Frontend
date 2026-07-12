import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchAllResultsByCourse, type ExamAttemptResponse } from '@/actions/courses'
import PageShell from '@/components/teacher/PageShell'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/EmptyState'

export default function CourseResults() {
  const navigate = useNavigate()
  const { courseId } = useParams<{ courseId: string }>()
  const { token } = useAuth()

  const [results, setResults] = useState<ExamAttemptResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadResults = async () => {
      if (!courseId || !token) return
      try {
        setLoading(true)
        setError(null)
        const id = parseInt(courseId, 10)
        if (isNaN(id)) {
          throw new Error('Invalid Course ID')
        }

        const data = await fetchAllResultsByCourse(token, id)
        setResults(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load course results.')
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [courseId, token])

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
          onClick={() => navigate(`/teacher/${courseId}`)}
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
        >
          Back to Course
        </button>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Panel', href: '/teacher' },
    { label: 'Course', href: `/teacher/${courseId}` },
    { label: 'Exam Results' }
  ]

  return (
    <PageShell
      title="Exam Results"
      subtitle="A list of all student attempts and scores for exams in this course."
      breadcrumbs={breadcrumbs}
    >
      <div className="w-full max-w-7xl mx-auto">
        <main>
          {results.length === 0 ? (
            <EmptyState
              icon="📊"
              title="No Exam Submissions"
              description="No students have taken or submitted any exams for this course yet."
            />
          ) : (
            <div className="glass-panel rounded-2xl border border-border-subtle overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle bg-black/5">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Student</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Exam Title</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Date Taken</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {results.map((attempt) => (
                    <tr
                      key={attempt.id}
                      onClick={() => navigate(`/teacher/attempt/${attempt.id}`)}
                      className="hover:bg-black/5 transition-colors duration-150 cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-text-primary">{attempt.student.name}</td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{attempt.exam.title}</td>
                      <td className="px-6 py-4 text-sm text-text-muted">
                        {new Date(attempt.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Badge
                          variant={!attempt.isGraded ? "secondary" : "outline"}
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
