import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchAllResultsByCourse, type ExamAttemptResponse } from '@/actions/courses'

export default function CourseResults() {
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
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-8 animate-pulse">
        <div className="h-4 w-32 bg-white/5 rounded mb-4" />
        <div className="h-10 w-80 bg-white/5 rounded mb-10" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center p-12 mt-16 rounded-2xl glass-panel border-white/[0.04] shadow-xl space-y-6">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-3xl">
          ⚠️
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Error</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{error}</p>
        </div>
        <Link
          to={`/teacher/${courseId}`}
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
        >
          Back to Course
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 pt-16 pb-16">
      <header className="mb-10 border-b border-white/[0.04] pb-6">
        <Link
          to={`/teacher/${courseId}`}
          className="text-xs text-text-muted hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer"
        >
          &larr; Back to Course
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          Exam Results
        </h1>
        <p className="text-text-secondary text-sm">
          A list of all student attempts and scores for exams in this course.
        </p>
      </header>

      <main>
        {results.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-2xl glass-panel border-white/[0.04] max-w-xl mx-auto space-y-4">
            <span className="text-4xl block">📊</span>
            <h3 className="text-lg font-bold text-white">No Exam Submissions</h3>
            <p className="text-xs text-text-secondary">
              No students have taken or submitted any exams for this course yet.
            </p>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl border border-white/[0.04] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.04] bg-white/[0.02]">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Student</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Exam Title</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Date Taken</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Score</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {results.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-white">{attempt.student.name}</td>
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
                    <td className="px-6 py-4 text-sm">
                      {attempt.score === null ? (
                        <span className="text-amber-400 font-medium">Pending Grading</span>
                      ) : (
                        <span className="text-emerald-400 font-bold">{attempt.score} Marks</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/teacher/attempt/${attempt.id}`}
                        className="text-xs font-bold text-accent-indigo hover:text-accent-indigo/80 transition-colors"
                      >
                        {attempt.score === null ? 'Grade Now' : 'Update Grade'} &rarr;
                      </Link>
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
