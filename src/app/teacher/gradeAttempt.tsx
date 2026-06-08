import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchAttemptWithAnswers, updateAttemptMarks, type ExamAttemptDetail } from '@/actions/courses'

export default function GradeExamAttempt() {
  const { attemptId } = useParams<{ attemptId: string }>()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [attempt, setAttempt] = useState<ExamAttemptDetail | null>(null)
  const [grades, setGrades] = useState<Array<{ answerId: number; awardedMarks: number }>>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

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
        
        const initialGrades = data.answers.map((ans) => ({
          answerId: ans.id,
          awardedMarks: ans.awardedMarks !== null ? ans.awardedMarks : (ans.studentAnswer.trim().toLowerCase() === ans.question.correctAnswer.trim().toLowerCase() ? ans.question.marks : 0),
        }))
        setGrades(initialGrades)
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load attempt details.')
      } finally {
        setLoading(false)
      }
    }

    loadAttempt()
  }, [attemptId, token])

  const handleGradeChange = (answerId: number, val: string, maxMarks: number) => {
    let numVal = parseInt(val, 10) || 0
    if (numVal < 0) numVal = 0
    if (numVal > maxMarks) numVal = maxMarks

    setGrades(
      grades.map((g) => (g.answerId === answerId ? { ...g, awardedMarks: numVal } : g))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !attempt) return

    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      await updateAttemptMarks(token, attempt.id, grades)
      setSuccess('Grades updated successfully!')
      setTimeout(() => {
        navigate(`/teacher/${attempt.exam.courseId}/results`)
      }, 1500)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to update grades.')
      setSubmitting(false)
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

  const currentScore = grades.reduce((acc, curr) => acc + curr.awardedMarks, 0)
  const totalPossibleScore = attempt.answers.reduce((acc, curr) => acc + curr.question.marks, 0)

  return (
    <div className="max-w-3xl mx-auto px-6 pt-16 pb-16">
      <header className="mb-10 border-b border-white/[0.04] pb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-xs text-text-muted hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer bg-transparent border-0 outline-none"
        >
          &larr; Go Back
        </button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              Grade Exam Attempt
            </h1>
            <p className="text-text-secondary text-sm">
              Review answers submitted by <span className="font-semibold text-white">{attempt.student.name}</span> ({attempt.student.email}) for <span className="font-semibold text-white">{attempt.exam.title}</span>.
            </p>
          </div>
          <div className="bg-bg-secondary border border-white/5 rounded-xl px-4 py-3 text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">Total Score</span>
            <span className="text-xl font-extrabold text-emerald-400">{currentScore} / {totalPossibleScore}</span>
          </div>
        </div>
      </header>

      <main>
        <form onSubmit={handleSubmit} className="space-y-8">
          {success && (
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-400">
              {success}
            </div>
          )}

          <div className="space-y-6">
            {attempt.answers.map((ans, idx) => {
              const gradeItem = grades.find((g) => g.answerId === ans.id)
              const awardedMarks = gradeItem ? gradeItem.awardedMarks : 0
              const isCorrectMatch = ans.studentAnswer.trim().toLowerCase() === ans.question.correctAnswer.trim().toLowerCase()

              return (
                <div
                  key={ans.id}
                  className="glass-panel p-6 rounded-xl border border-white/[0.04] space-y-4"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-white/[0.04]">
                    <span className="text-xs font-bold text-accent-indigo">Question #{idx + 1}</span>
                    <span className="text-xs text-text-muted">Max: {ans.question.marks} Marks</span>
                  </div>

                  <p className="text-sm font-semibold text-white">
                    {ans.question.questionText}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 text-xs">
                      <span className="font-bold uppercase tracking-wider text-[9px] text-text-muted block mb-1">
                        Student's Answer
                      </span>
                      <span className={isCorrectMatch ? 'text-emerald-400 font-semibold' : 'text-rose-400'}>
                        {ans.studentAnswer}
                      </span>
                    </div>

                    <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-400">
                      <span className="font-bold uppercase tracking-wider text-[9px] text-emerald-500 block mb-1">
                        Correct Answer
                      </span>
                      {ans.question.correctAnswer}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-text-secondary">
                      Status: {isCorrectMatch ? (
                        <span className="text-emerald-400 font-semibold">Exact Match ✓</span>
                      ) : (
                        <span className="text-rose-400 font-semibold">Mismatch ✗</span>
                      )}
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="text-xs text-text-secondary">Awarded Marks:</label>
                      <input
                        type="number"
                        min="0"
                        max={ans.question.marks}
                        value={awardedMarks}
                        onChange={(e) => handleGradeChange(ans.id, e.target.value, ans.question.marks)}
                        className="w-16 px-2.5 py-1 rounded bg-bg-secondary border border-white/10 focus:border-accent-indigo outline-none text-center text-sm text-white"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Saving...' : 'Submit Grades'}
          </button>
        </form>
      </main>
    </div>
  )
}
