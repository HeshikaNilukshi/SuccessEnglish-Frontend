import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchAttemptWithAnswers, type ExamAttemptDetail } from '@/actions/courses'

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

  if (error || !attempt) {
    return (
      <div className="max-w-md mx-auto text-center p-12 mt-16 rounded-2xl glass-panel border-white/[0.04] shadow-xl space-y-6">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-3xl">
          ⚠️
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Error</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{error || 'Attempt details unavailable.'}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
        >
          Go Back
        </button>
      </div>
    )
  }

  const totalPossibleScore = attempt.answers.reduce((acc, curr) => acc + curr.question.marks, 0)

  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 pb-16 relative">
      {/* Sticky Score Banner */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-bg-primary/95 backdrop-blur-md border-b border-white/[0.04] py-4 shadow-md animate-fade-in">
        <div className="max-w-3xl mx-auto px-6 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Exam Results View</span>
            <span className="text-sm font-bold text-white truncate max-w-[200px] md:max-w-md">{attempt.student.name}</span>
          </div>
          <div className="bg-bg-secondary border border-white/5 rounded-xl px-4 py-2 text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">Total Score</span>
            <span className="text-lg font-extrabold text-emerald-400">{attempt.score ?? 0} / {totalPossibleScore}</span>
          </div>
        </div>
      </div>

      <header className="mb-10 border-b border-white/[0.04] pb-6">
        <button
          onClick={() => navigate(`/student/${attempt.exam.courseId}`)}
          className="text-xs text-text-muted hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer bg-transparent border-0 outline-none"
        >
          &larr; Back to Course
        </button>
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            View Graded Answersheet
          </h1>
          <p className="text-text-secondary text-sm">
            Review answers for <span className="font-semibold text-white">{attempt.exam.title}</span>.
          </p>
        </div>
      </header>

      <main className="space-y-6">
        {attempt.answers.map((ans, idx) => {
          const isCorrectVal = ans.isCorrect

          const studentAnswerContainerClass = () => {
            if (isCorrectVal === true) {
              return 'p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-400'
            }
            if (isCorrectVal === false) {
              return 'p-4 rounded-lg bg-rose-500/5 border border-rose-500/10 text-xs text-rose-400'
            }
            return 'p-4 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-white'
          }

          return (
            <div
              key={ans.id}
              className="glass-panel p-6 rounded-xl border border-white/[0.04] space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.04]">
                <span className="text-xs font-bold text-accent-indigo">Question #{idx + 1}</span>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-text-muted">
                  Given Marks: {isCorrectVal === true ? ans.question.marks : 0} / {ans.question.marks}
                </span>
              </div>

              <p className="text-sm font-semibold text-white">
                {ans.question.questionText}
              </p>

              <div className="space-y-4">
                {/* Student's Answer */}
                <div className={studentAnswerContainerClass()}>
                  <span className={`font-bold uppercase tracking-wider text-[9px] block mb-1 ${
                    isCorrectVal === true 
                      ? 'text-emerald-500' 
                      : isCorrectVal === false 
                        ? 'text-rose-400' 
                        : 'text-text-muted'
                  }`}>
                    Your Answer
                  </span>
                  <span>{ans.studentAnswer}</span>
                </div>

                {/* Correct Answer */}
                <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-400">
                  <span className="font-bold uppercase tracking-wider text-[9px] text-emerald-500 block mb-1">
                    Correct Answer
                  </span>
                  {ans.question.correctAnswer}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                  isCorrectVal === true
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : isCorrectVal === false
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      : 'bg-white/5 border-white/10 text-text-secondary'
                }`}>
                  {isCorrectVal === true ? '✓ Correct' : isCorrectVal === false ? '✗ Incorrect' : 'Pending Grading'}
                </span>
              </div>
            </div>
          )
        })}
      </main>
    </div>
  )
}
