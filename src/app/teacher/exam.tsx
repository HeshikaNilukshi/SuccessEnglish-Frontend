import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchExamDetails } from '@/actions/courses'

export default function TeacherExamView() {
  const { courseId, examId } = useParams<{ courseId: string; examId: string }>()
  const { token } = useAuth()

  const [exam, setExam] = useState<(Exam & { questions: any[] }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadExam = async () => {
      if (!examId || !token) return
      try {
        setLoading(true)
        setError(null)
        const id = parseInt(examId, 10)
        if (isNaN(id)) {
          throw new Error('Invalid Exam ID')
        }

        const data = await fetchExamDetails(token, id)
        setExam(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load exam details.')
      } finally {
        setLoading(false)
      }
    }

    loadExam()
  }, [examId, token])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-8 animate-pulse">
        <div className="h-4 w-32 bg-white/5 rounded mb-4" />
        <div className="h-10 w-96 bg-white/5 rounded mb-4" />
        <div className="h-4 w-48 bg-white/5 rounded mb-10" />
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-40 bg-white/5 rounded-xl border border-white/[0.04]" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !exam) {
    return (
      <div className="max-w-md mx-auto text-center p-12 mt-16 rounded-2xl glass-panel border-white/[0.04] shadow-xl space-y-6">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-3xl">
          ⚠️
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Error</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{error || 'Exam details unavailable.'}</p>
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
    <div className="max-w-3xl mx-auto px-6 pt-16 pb-16">
      <header className="mb-10 border-b border-white/[0.04] pb-6">
        <Link
          to={`/teacher/${courseId}`}
          className="text-xs text-text-muted hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer"
        >
          &larr; Back to Course
        </Link>
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              {exam.title}
            </h1>
            <p className="text-text-secondary text-sm">
              Exam preview mode for teachers. Correct answers and marks are visible.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/25">
            {exam.duration > 0 ? `${exam.duration} Minutes` : 'Untimed'}
          </span>
        </div>
      </header>

      <main className="space-y-6">
        {exam.questions.map((q, idx) => (
          <div
            key={q.id}
            className="glass-panel p-6 rounded-xl border border-white/[0.04] space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-white/[0.04]">
              <span className="text-xs font-bold text-accent-indigo">Question #{idx + 1}</span>
              <span className="text-xs text-text-muted">{q.marks} Marks</span>
            </div>

            <p className="text-sm font-semibold text-white">
              {q.questionText}
            </p>

            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-400">
              <span className="font-bold uppercase tracking-wider text-[10px] block mb-1 text-emerald-500">
                Correct Answer
              </span>
              {q.correctAnswer}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
