import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchStudentResultsByCourse, type StudentAttemptResponse } from '@/actions/courses'

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
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-8 animate-pulse">
        <div className="h-4 w-32 bg-black/5 rounded mb-4" />
        <div className="h-10 w-80 bg-black/5 rounded mb-10" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-black/5 rounded-xl" />
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
        <Link
          to={`/teacher/${courseId}/students`}
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
        >
          Back to Students
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 pt-16 pb-16">
      <header className="mb-10 border-b border-border-subtle pb-6">
        <Link
          to={`/teacher/${courseId}/students`}
          className="text-xs text-text-muted hover:text-text-primary transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer"
        >
          &larr; Back to Students List
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary mb-2">
          Student Exam Attempts
        </h1>
        <p className="text-text-secondary text-sm">
          Detailed list of exam results for this specific student.
        </p>
      </header>

      <main>
        {attempts.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-2xl glass-panel border-border-subtle max-w-xl mx-auto space-y-4">
            <span className="text-4xl block">📝</span>
            <h3 className="text-lg font-bold text-text-primary">No Attempts Yet</h3>
            <p className="text-xs text-text-secondary">
              This student has not attempted any exams for this course yet.
            </p>
          </div>
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
                      {new Date(attempt.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      {!attempt.isGraded ? (
                        <span className="text-amber-400 font-medium">Pending Grading</span>
                      ) : (
                        <span className="text-emerald-900 font-medium font-bold">{attempt.score} Marks</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
