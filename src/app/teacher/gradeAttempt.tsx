import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  fetchAttemptWithAnswers,
  updateAttemptMarks,
  evaluateAttemptWithAI,
  evaluateAnswerWithAI,
  type ExamAttemptDetail
} from '@/actions/courses'

export default function GradeExamAttempt() {
  const { attemptId } = useParams<{ attemptId: string }>()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [attempt, setAttempt] = useState<ExamAttemptDetail | null>(null)
  const [grades, setGrades] = useState<Array<{
    answerId: number;
    marksAwarded: number | null;
    similarity?: number | null;
    feedback?: string | null;
  }>>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // AI grading states
  const [isGradingAll, setIsGradingAll] = useState(false)
  const [gradingAnswerIds, setGradingAnswerIds] = useState<Record<number, boolean>>({})

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
          marksAwarded: ans.marksAwarded ?? null,
          similarity: ans.similarity,
          feedback: ans.feedback,
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

  const handleGradeChange = (answerId: number, val: number | null) => {
    setGrades((prev) =>
      prev.map((g) => (g.answerId === answerId ? { ...g, marksAwarded: val } : g))
    )
  }

  const handleFeedbackChange = (answerId: number, val: string) => {
    setGrades((prev) =>
      prev.map((g) => (g.answerId === answerId ? { ...g, feedback: val } : g))
    )
  }

  const handleGradeAllWithAI = async () => {
    if (!token || !attemptId) return
    setIsGradingAll(true)
    setError(null)
    setSuccess(null)
    try {
      const results = await evaluateAttemptWithAI(token, parseInt(attemptId, 10))
      // results is an array of { answerId, similarity, marks, feedback }
      setGrades((prevGrades) =>
        prevGrades.map((g) => {
          const aiRes = results.find((r: any) => r.answerId === g.answerId)
          if (aiRes) {
            return {
              ...g,
              marksAwarded: aiRes.marks,
              feedback: aiRes.feedback,
              similarity: aiRes.similarity,
            }
          }
          return g
        })
      )
      setSuccess('AI grading completed for all answers! Please review and submit.')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'AI grading failed.')
    } finally {
      setIsGradingAll(false)
    }
  }

  const handleGradeOneWithAI = async (answerId: number) => {
    if (!token) return
    setGradingAnswerIds((prev) => ({ ...prev, [answerId]: true }))
    setError(null)
    setSuccess(null)
    try {
      const aiRes = await evaluateAnswerWithAI(token, answerId)
      // aiRes is { similarity, marks, feedback }
      setGrades((prevGrades) =>
        prevGrades.map((g) =>
          g.answerId === answerId
            ? {
              ...g,
              marksAwarded: aiRes.marks,
              feedback: aiRes.feedback,
              similarity: aiRes.similarity,
            }
            : g
        )
      )
      setSuccess('AI grading completed for this answer!')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'AI grading failed for this answer.')
    } finally {
      setGradingAnswerIds((prev) => ({ ...prev, [answerId]: false }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !attempt) return

    const ungradedAnswers = grades.filter((g) => g.marksAwarded === null)
    if (ungradedAnswers.length > 0) {
      setError(`Please grade all questions before submitting. (${ungradedAnswers.length} left)`)
      return
    }

    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const payload = grades.map((g) => {
        const item: any = {
          answerId: g.answerId,
          marksAwarded: g.marksAwarded,
        }
        if (g.similarity !== undefined && g.similarity !== null) {
          item.similarity = g.similarity
        }
        if (g.feedback !== undefined && g.feedback !== null) {
          item.feedback = g.feedback
        }
        return item
      })

      await updateAttemptMarks(token, attempt.id, payload)
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
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-3xl">
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

  const currentScore = attempt.answers.reduce((acc, ans) => {
    const gradeItem = grades.find((g) => g.answerId === ans.id)
    return acc + (gradeItem?.marksAwarded ?? 0)
  }, 0)
  const totalPossibleScore = attempt.answers.reduce((acc, curr) => acc + curr.question.marks, 0)

  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 pb-16 relative">
      {/* Sticky Score Banner */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle py-4 shadow-md animate-fade-in">
        <div className="max-w-3xl mx-auto px-6 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Grading Exam Attempt</span>
            <span className="text-sm font-bold text-text-primary truncate max-w-[200px] md:max-w-md">{attempt.student.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleGradeAllWithAI}
              disabled={isGradingAll || submitting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-accent-indigo hover:bg-accent-indigo/80 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-accent-indigo/10"
            >
              {isGradingAll ? (
                <>
                  <span className="animate-spin">⏳</span> Grading...
                </>
              ) : (
                <>✨ Grade Attempt With AI</>
              )}
            </button>
            <div className="bg-bg-secondary border border-border-subtle rounded-xl px-4 py-2 text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">Total Score</span>
              <span className="text-lg font-extrabold text-emerald-400">{currentScore} / {totalPossibleScore}</span>
            </div>
          </div>
        </div>
      </div>

      <header className="mb-10 border-b border-border-subtle pb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-xs text-text-muted hover:text-text-primary transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer bg-transparent border-0 outline-none"
        >
          &larr; Go Back
        </button>
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary mb-2">
            Grade Exam Attempt
          </h1>
          <p className="text-text-secondary text-sm">
            Review answers submitted by <span className="font-semibold text-text-primary">{attempt.student.name}</span> ({attempt.student.email}) for <span className="font-semibold text-text-primary">{attempt.exam.title}</span>.
          </p>
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
              const marks = gradeItem ? gradeItem.marksAwarded : null

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
                    <div className="flex items-center gap-3">
                      {marks !== null && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${marks === ans.question.marks
                            ? 'bg-emerald-500/12 border-emerald-500/25 text-emerald-700'
                            : marks > 0
                              ? 'bg-amber-500/12 border-amber-500/25 text-amber-700'
                              : 'bg-rose-500/12 border-rose-500/25 text-rose-700'
                          }`}>
                          {marks} / {ans.question.marks} Marks Given
                        </span>
                      )}
                      <span className="text-xs text-text-muted">
                        Max {ans.question.marks} Marks
                      </span>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-text-primary">
                    {ans.question.questionText}
                  </p>

                  <div className="space-y-4">
                    {/* Student's Answer */}
                    <div className={studentAnswerContainerClass()}>
                      <span className={`font-bold uppercase tracking-wider text-[9px] block mb-1 ${marks === ans.question.marks
                          ? 'text-emerald-700'
                          : (marks !== null && marks > 0)
                            ? 'text-amber-700'
                            : marks === 0
                              ? 'text-rose-700'
                              : 'text-slate-500'
                        }`}>
                        Student's Answer
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

                  <div className="space-y-4 pt-4 border-t border-border-subtle">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                      {/* Numeric Grade Input */}
                      <div className="flex-1 space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                          Marks Awarded (Max: {ans.question.marks})
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            max={ans.question.marks}
                            value={marks ?? ''}
                            onChange={(e) => {
                              const val = e.target.value === '' ? null : Math.min(ans.question.marks, Math.max(0, parseInt(e.target.value, 10)))
                              handleGradeChange(ans.id, val)
                            }}
                            placeholder="Enter marks"
                            className="bg-black/5 border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-indigo transition-colors w-32"
                            disabled={submitting || isGradingAll || gradingAnswerIds[ans.id]}
                          />
                          <span className="text-sm text-text-muted">/ {ans.question.marks} Marks</span>
                        </div>
                      </div>

                      {/* AI Evaluation Button */}
                      <button
                        type="button"
                        onClick={() => handleGradeOneWithAI(ans.id)}
                        disabled={submitting || isGradingAll || gradingAnswerIds[ans.id]}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-accent-indigo bg-accent-indigo/10 border border-accent-indigo/20 hover:bg-accent-indigo/20 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        {gradingAnswerIds[ans.id] ? (
                          <>
                            <span className="animate-spin">⏳</span> Grading...
                          </>
                        ) : (
                          <>✨ Grade with AI</>
                        )}
                      </button>
                    </div>

                    {/* Feedback and Similarity Section */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                        Feedback {gradeItem?.similarity !== undefined && gradeItem?.similarity !== null && (
                          <span className="text-emerald-400 font-normal normal-case ml-2">
                            (AI Similarity: {Math.round(gradeItem.similarity * 100)}%)
                          </span>
                        )}
                      </label>
                      <textarea
                        value={gradeItem?.feedback ?? ''}
                        onChange={(e) => handleFeedbackChange(ans.id, e.target.value)}
                        placeholder="Add comments or feedback for the student..."
                        rows={2}
                        className="w-full bg-black/5 border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-indigo transition-colors resize-none"
                        disabled={submitting || isGradingAll || gradingAnswerIds[ans.id]}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <button
            type="submit"
            disabled={submitting || isGradingAll}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Saving...' : 'Submit Grades'}
          </button>
        </form>
      </main>
    </div>
  )
}