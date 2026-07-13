import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchAttemptWithAnswers, type ExamAttemptDetail } from '@/actions/courses'
import PageShell from '@/components/teacher/PageShell'
import { formatDate } from '@/lib/utils'

export default function StudentAttemptView() {
  const { attemptId } = useParams<{ attemptId: string }>()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [attempt, setAttempt] = useState<ExamAttemptDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAttempt = async () => {
      if (!attemptId || !token) return
      try {
        setLoading(true)
        setError(null)
        const id = parseInt(attemptId, 10)
        if (isNaN(id)) {
          throw new Error('Invalid Attempt ID')
        }

        const data = await fetchAttemptWithAnswers(token, id)
        setAttempt(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load attempt details.')
      } finally {
        setLoading(false)
      }
    }

    loadAttempt()
  }, [attemptId, token])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 animate-pulse">
        <div className="h-4 w-32 bg-black/5 rounded mb-4" />
        <div className="h-10 w-96 bg-black/5 rounded mb-4" />
        <div className="h-4 w-48 bg-black/5 rounded mb-10" />
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-40 bg-black/5 rounded-xl border border-border-subtle" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !attempt) {
    return (
      <div className="max-w-md mx-auto text-center p-12 mt-16 rounded-2xl glass-panel border-border-subtle shadow-xl space-y-6">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-900 font-medium text-3xl">
          ⚠️
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-text-primary">Error</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{error || 'Attempt details unavailable.'}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
        >
          Go Back
        </button>
      </div>
    )
  }

  const totalPossibleScore = attempt.answers.reduce((acc, curr) => acc + curr.question.marks, 0)

  const breadcrumbs = [
    { label: 'Home', href: '/student' },
    { label: 'Course', href: `/student/${attempt.exam.courseId}` },
    { label: 'Attempt Review' }
  ]

  return (
    <PageShell
      title="View Graded Answersheet"
      subtitle={
        <>
          Review answers for <span className="font-semibold text-white">{attempt.exam.title}</span>
        </>
      }
      infoText={
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold">Score: {attempt.score ?? 0} / {totalPossibleScore}</span>
          <span className="opacity-60">•</span>
          <span>Date Taken: {formatDate(attempt.createdAt)}</span>
        </div>
      }
      breadcrumbs={breadcrumbs}
    >

      <main className="space-y-6">
        {attempt.answers.map((ans, idx) => {
          const marks = ans.marksAwarded

          const studentAnswerContainerClass = () => {
            if (marks === ans.question.marks) {
              return 'p-4 rounded-lg bg-emerald-500/12 border border-emerald-500/25 text-xs text-emerald-900 font-medium'
            }
            if (marks !== null && marks > 0) {
              return 'p-4 rounded-lg bg-amber-500/12 border border-amber-500/25 text-xs text-amber-900 font-medium'
            }
            if (marks === 0) {
              return 'p-4 rounded-lg bg-rose-500/12 border border-rose-500/25 text-xs text-rose-900 font-medium'
            }
            return 'p-4 rounded-lg bg-black/8 border border-border-subtle text-xs text-slate-800'
          }

          return (
            <div
              key={ans.id}
              className="glass-panel p-6 rounded-xl border border-border-subtle space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
                <span className="text-xs font-bold text-accent-indigo">Question {idx + 1}</span>
                <span className="px-3 py-1.5 rounded-xl bg-black/8 border border-border-subtle text-xs md:text-sm font-extrabold text-slate-700">
                  Given Marks: {marks !== null ? marks : 'Pending'} / {ans.question.marks}
                </span>
              </div>

              <p className="text-sm font-semibold text-text-primary">
                {ans.question.questionText}
              </p>

              <div className="space-y-4">
                {/* Student's Answer */}
                <div className={studentAnswerContainerClass()}>
                  <span className={`font-bold uppercase tracking-wider text-[9px] block mb-1 ${
                    marks === ans.question.marks
                      ? 'text-emerald-700' 
                      : (marks !== null && marks > 0)
                        ? 'text-amber-700'
                        : marks === 0 
                          ? 'text-rose-700' 
                          : 'text-slate-500'
                  }`}>
                    Your Answer
                  </span>
                  <span>{ans.studentAnswer}</span>
                </div>

                {/* Correct Answer */}
                <div className="p-4 rounded-lg bg-emerald-500/12 border border-emerald-500/25 text-xs text-emerald-900 font-medium">
                  <span className="font-bold uppercase tracking-wider text-[9px] text-emerald-700 block mb-1">
                    Correct Answer
                  </span>
                  {ans.question.correctAnswer}
                </div>
              </div>

              {ans.feedback && (
                <div className="p-4 rounded-lg bg-black/8 border border-border-subtle text-xs text-slate-800 space-y-2">
                  <span className="font-bold uppercase tracking-wider text-[9px] text-accent-indigo block">
                    Feedback
                  </span>
                  <div className="mt-1 leading-relaxed text-text-secondary">
                    {ans.feedback}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <span className={`px-4 py-2 rounded-full text-xs md:text-sm font-extrabold border ${
                  marks === ans.question.marks
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900 font-medium'
                    : marks !== null && marks > 0
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      : marks === 0
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        : 'bg-black/5 border-border-subtle text-text-secondary'
                }`}>
                  {marks === ans.question.marks ? '✓ Fully Correct' : marks !== null && marks > 0 ? '✓ Partially Correct' : marks === 0 ? '✗ Incorrect' : 'Pending Grading'}
                </span>
              </div>
            </div>
          )
        })}
      </main>
    </PageShell>
  )
}
