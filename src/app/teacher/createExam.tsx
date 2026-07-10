import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { createExam, updateExam, fetchExamDetails, type CreateQuestionInput } from '@/actions/courses'

export default function CreateExam() {
  const { courseId, examId } = useParams<{ courseId: string; examId?: string }>()
  const { token } = useAuth()
  const navigate = useNavigate()

  const isEditing = !!examId

  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState('0')
  const [passMark, setPassMark] = useState('0')
  const [questions, setQuestions] = useState<CreateQuestionInput[]>([
    { questionText: '', correctAnswer: '', marks: 5 }
  ])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadExamData = async () => {
      if (!isEditing || !examId || !token) return
      try {
        setSubmitting(true)
        setError(null)
        const data = await fetchExamDetails(token, parseInt(examId, 10))
        setTitle(data.title)
        setDuration(data.duration.toString())
        setPassMark(data.passMark ? data.passMark.toString() : '0')
        setQuestions(data.questions.map(q => ({
          questionText: q.questionText,
          correctAnswer: q.correctAnswer,
          marks: q.marks
        })))
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load exam details.')
      } finally {
        setSubmitting(false)
      }
    }
    loadExamData()
  }, [examId, token, isEditing])

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', correctAnswer: '', marks: 5 }])
  }

  const handleRemoveQuestion = (index: number) => {
    if (questions.length === 1) return
    const updated = [...questions]
    updated.splice(index, 1)
    setQuestions(updated)
  }

  const handleQuestionChange = (index: number, field: keyof CreateQuestionInput, value: any) => {
    const updated = [...questions]
    if (field === 'marks') {
      updated[index].marks = parseInt(value, 10) || 0
    } else {
      updated[index][field] = value as string
    }
    setQuestions(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !courseId) return

    if (!title.trim()) {
      setError('Exam title is required')
      return
    }

    const durationMins = parseInt(duration, 10)
    if (isNaN(durationMins) || durationMins < 0) {
      setError('Duration must be 0 or a positive number')
      return
    }

    const passMarkVal = parseInt(passMark, 10)
    if (isNaN(passMarkVal) || passMarkVal < 0) {
      setError('Pass mark must be 0 or a positive number')
      return
    }

    if (questions.length === 0) {
      setError('At least one question is required')
      return
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.questionText.trim()) {
        setError(`Question ${i + 1} text is required`)
        return
      }
      if (!q.correctAnswer.trim()) {
        setError(`Correct answer for Question ${i + 1} is required`)
        return
      }
      if (q.marks <= 0) {
        setError(`Question ${i + 1} must award at least 1 mark`)
        return
      }
    }

    setSubmitting(true)
    setError(null)

    try {
      if (isEditing && examId) {
        await updateExam(token, parseInt(examId, 10), {
          title,
          duration: durationMins,
          passMark: passMarkVal,
          questions,
        })
        navigate(`/teacher/${courseId}/exams/${examId}`)
      } else {
        await createExam(token, {
          title,
          courseId: parseInt(courseId, 10),
          duration: durationMins,
          passMark: passMarkVal,
          questions,
        })
        navigate(`/teacher/${courseId}`)
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || `Failed to ${isEditing ? 'save' : 'create'} exam.`)
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 pt-16 pb-16">
      <header className="mb-10 border-b border-border-subtle pb-6">
        <Link
          to={isEditing && examId ? `/teacher/${courseId}/exams/${examId}` : `/teacher/${courseId}`}
          className="text-xs text-text-muted hover:text-text-primary transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer"
        >
          &larr; Back to {isEditing ? 'Exam' : 'Course'}
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary font-sans">
          {isEditing ? 'Edit Assessment Exam' : 'Create Assessment Exam'}
        </h1>
        <p className="text-text-secondary text-sm">
          {isEditing ? 'Modify exam details and update questions.' : 'Define exam title, time limit, and enter questions with correct answers.'}
        </p>
      </header>

      <main className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/12 border border-red-500/25 text-xs text-red-900 font-medium">
              {error}
            </div>
          )}

          <div className="glass-panel p-8 rounded-2xl border border-border-subtle space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Exam Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Grammar Pop Quiz 1"
                className="w-full mt-1 px-4 py-3 rounded-xl bg-bg-secondary border border-border-subtle focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-text-primary placeholder-white/20 outline-none transition-all"
                disabled={submitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Duration in minutes
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-bg-secondary border border-border-subtle focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-text-primary outline-none transition-all"
                  disabled={submitting}
                />
                <span className="text-xs text-text-secondary px-1">(0 for unlimited)</span>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Pass Mark
                </label>
                <input
                  type="number"
                  value={passMark}
                  onChange={(e) => setPassMark(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-bg-secondary border border-border-subtle focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-text-primary outline-none transition-all"
                  disabled={submitting}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-bold text-text-primary">Questions</h2>

            {questions.map((q, idx) => (
              <div
                key={idx}
                className="relative glass-panel p-6 rounded-xl border border-border-subtle space-y-4"
              >
                <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
                  <span className="text-xs font-bold text-accent-indigo">Question #{idx + 1}</span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(idx)}
                      className="text-xs text-red-900 font-medium hover:text-red-300 cursor-pointer"
                      disabled={submitting}
                    >
                      Delete
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Question Text
                  </label>
                  <input
                    type="text"
                    value={q.questionText}
                    onChange={(e) => handleQuestionChange(idx, 'questionText', e.target.value)}
                    placeholder="e.g., What is the past participle of 'go'?"
                    className="w-full px-4 py-2.5 rounded-lg bg-bg-secondary border border-border-subtle focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-text-primary placeholder-white/20 outline-none transition-all"
                    disabled={submitting}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      Correct Answer
                    </label>
                    <input
                      type="text"
                      value={q.correctAnswer}
                      onChange={(e) => handleQuestionChange(idx, 'correctAnswer', e.target.value)}
                      placeholder="e.g., gone"
                      className="w-full px-4 py-2.5 rounded-lg bg-bg-secondary border border-border-subtle focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-text-primary placeholder-white/20 outline-none transition-all"
                      disabled={submitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      Marks
                    </label>
                    <input
                      type="number"
                      value={q.marks}
                      onChange={(e) => handleQuestionChange(idx, 'marks', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-bg-secondary border border-border-subtle focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-text-primary outline-none transition-all"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddQuestion}
              className="w-full py-3 border border-dashed border-border-subtle hover:border-border-subtle rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary transition-all cursor-pointer bg-black/5"
              disabled={submitting}
            >
              + Add Question
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (isEditing ? 'Saving...' : 'Creating Exam...') : (isEditing ? 'Save Changes' : 'Publish Exam')}
          </button>
        </form>
      </main>
    </div>
  )
}
