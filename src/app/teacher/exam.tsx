import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchExamDetails, deleteExam } from '@/actions/courses'
import { createPortal } from 'react-dom'
import PageShell from '@/components/teacher/PageShell'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'

export default function TeacherExamView() {
  const { courseId, examId } = useParams<{ courseId: string; examId: string }>()
  const { token } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const basePath = location.pathname.startsWith('/admin') ? '/admin/courses' : '/teacher'

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
      navigate(`${basePath}/${courseId}`)
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to delete exam.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <header className="mb-6">
          <div className="h-4 w-32 bg-black/5 rounded mb-4 animate-pulse" />
          <div className="h-10 w-96 bg-black/5 rounded mb-4 animate-pulse" />
          <div className="h-4 w-48 bg-black/5 rounded mb-10 animate-pulse" />
        </header>
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-40 bg-black/5 rounded-xl border border-border-subtle animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !exam) {
    return (
      <div className="max-w-md mx-auto text-center p-12 mt-16 rounded-2xl glass-panel border-border-subtle shadow-xl space-y-6">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-900 font-medium text-3xl">
          ⚠️
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-text-primary">Error</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{error || 'Exam details unavailable.'}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(`${basePath}/${courseId}`)}
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
        >
          Back to Course
        </button>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Home', href: basePath },
    { label: 'Course', href: `${basePath}/${courseId}` },
    { label: exam.title }
  ]

  const actions = (
    <div className="flex items-center gap-3 shrink-0">
      <button
        type="button"
        onClick={() => navigate(`${basePath}/${courseId}/exams/${examId}/edit`)}
        className="px-4 py-2 text-xs font-bold text-text-primary rounded-xl bg-black/5 border border-border-subtle hover:bg-black/5 hover:border-border-subtle active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-1.5"
      >
        ✏️ Edit Exam
      </button>
      <button
        type="button"
        onClick={() => setIsDeleteOpen(true)}
        className="px-4 py-2 text-xs font-bold text-white rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-1.5"
      >
        🗑️ Delete Exam
      </button>
    </div>
  )

  const subtitle = "Exam preview mode for teachers. Correct answers and marks are visible."

  const infoText = (
    <div className="flex items-center gap-2 flex-wrap">
      <span>Duration: {exam.duration > 0 ? `${exam.duration} Minutes` : 'Untimed'}</span>
      <span className="opacity-60">•</span>
      <span>Created: {formatDate(exam.createdAt)}</span>
    </div>
  )

  return (
    <PageShell
      title={exam.title}
      subtitle={subtitle}
      infoText={infoText}
      breadcrumbs={breadcrumbs}
      actions={actions}
    >
      <div className="w-full max-w-7xl mx-auto space-y-6">
        <main className="space-y-6">
          {exam.questions.map((q, idx) => (
            <Card
              key={q.id}
              className="glass-panel border border-border-subtle"
            >
              <CardHeader className="flex flex-row justify-between items-center pb-2">
                <Badge variant="outline" className="font-semibold bg-accent-indigo/10 text-accent-indigo border-accent-indigo/25">
                  Question #{idx + 1}
                </Badge>
                <Badge variant="secondary" className="font-medium bg-black/5 text-text-primary border-none select-none">
                  {q.marks} Marks
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <Separator className="bg-border-subtle mb-4" />
                <p className="text-sm font-semibold text-text-primary">
                  {q.questionText}
                </p>

                <div className="p-4 rounded-lg bg-emerald-500/12 border border-emerald-500/25 text-xs text-emerald-900 font-medium">
                  <span className="font-bold uppercase tracking-wider text-[10px] block mb-1 text-emerald-500">
                    Correct Answer
                  </span>
                  {q.correctAnswer}
                </div>
              </CardContent>
            </Card>
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
              <div className="relative w-full max-w-md rounded-3xl bg-bg-secondary/95 backdrop-blur-xl border border-border-subtle shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 md:p-8 animate-popover-in text-center overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/35 to-transparent" />
                <div className="absolute top-[-20%] left-[20%] w-[200px] h-[200px] bg-red-500/8 rounded-full blur-[60px] pointer-events-none" />

                <button
                  type="button"
                  onClick={() => setIsDeleteOpen(false)}
                  disabled={isDeleting}
                  className="absolute top-4 right-4 text-text-muted hover:text-text-primary p-2 rounded-full hover:bg-black/5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="relative w-20 h-20 mx-auto mb-6 rounded-2xl overflow-hidden flex items-center justify-center bg-red-500/10 border border-red-500/20 shadow-lg shadow-red-500/10">
                  <svg className="w-9 h-9 text-red-900 font-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-text-primary mb-1">Delete Exam?</h3>
                <p className="text-sm text-text-secondary mb-8 leading-relaxed">
                  Are you sure you want to delete <span className="text-text-primary font-semibold">"{exam.title}"</span>? This action is permanent and cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDeleteOpen(false)}
                    disabled={isDeleting}
                    className="flex-1 py-3 text-sm font-bold text-text-secondary hover:text-text-primary rounded-2xl border border-border-subtle hover:border-border-subtle bg-black/5 hover:bg-black/5 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
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
          </>
        ,
          document.body
        )}
      </div>
    </PageShell>
  )
}
