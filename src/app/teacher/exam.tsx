import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchExamDetails, deleteExam } from '@/actions/courses'
import { createPortal } from 'react-dom'

export default function TeacherExamView() {
  const { courseId, examId } = useParams<{ courseId: string; examId: string }>()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [exam, setExam] = useState<(Exam & { questions: any[] }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const handleDeleteConfirm = async () => {
    if (!token || !examId || !courseId) return
    setIsDeleting(true)
    try {
      await deleteExam(token, parseInt(examId, 10))
      setIsDeleteOpen(false)
      navigate(`/teacher/${courseId}`)
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to delete exam.')
    } finally {
      setIsDeleting(false)
    }
  }

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <Link
            to={`/teacher/${courseId}`}
            className="text-xs text-text-muted hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5 group cursor-pointer"
          >
            &larr; Back to Course
          </Link>
          
          <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
            <Link
              to={`/teacher/${courseId}/exams/${examId}/edit`}
              className="px-4 py-2 text-xs font-bold text-white rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              ✏️ Edit Exam
            </Link>
            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              🗑️ Delete Exam
            </button>
          </div>
        </div>

        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              {exam.title}
            </h1>
            <p className="text-text-secondary text-sm">
              Exam preview mode for teachers. Correct answers and marks are visible.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/25 shrink-0 self-start">
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

      {/* Delete Exam Modal */}
      {isDeleteOpen && createPortal(
        <>
          <div
            className="fixed inset-0 bg-[#060813]/70 backdrop-blur-md z-50 transition-opacity duration-300 animate-fade-in"
            onClick={() => !isDeleting && setIsDeleteOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="relative w-full max-w-md rounded-3xl bg-bg-secondary/95 backdrop-blur-xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 md:p-8 animate-popover-in text-center overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/35 to-transparent" />
              <div className="absolute top-[-20%] left-[20%] w-[200px] h-[200px] bg-red-500/8 rounded-full blur-[60px] pointer-events-none" />

              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                disabled={isDeleting}
                className="absolute top-4 right-4 text-text-muted hover:text-white p-2 rounded-full hover:bg-white/[0.04] transition-all cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="relative w-20 h-20 mx-auto mb-6 rounded-2xl overflow-hidden flex items-center justify-center bg-red-500/10 border border-red-500/20 shadow-lg shadow-red-500/10">
                <svg className="w-9 h-9 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">Delete Exam?</h3>
              <p className="text-sm text-text-secondary mb-8 leading-relaxed">
                Are you sure you want to delete <span className="text-white font-semibold">"{exam.title}"</span>? This action is permanent and cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 py-3 text-sm font-bold text-text-secondary hover:text-white rounded-2xl border border-white/[0.07] hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 py-3 text-sm font-bold text-white rounded-2xl bg-red-500/80 hover:bg-red-500 border border-red-500/30 hover:border-red-500/60 transition-all duration-200 active:scale-[0.98] hover:shadow-[0_0_20px_rgba(239,68,68,0.25)] cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  )
}
