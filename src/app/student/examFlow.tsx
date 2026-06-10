import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchExamDetails, startExamAttempt, submitExamAttempt } from '@/actions/courses'

export default function StudentExamFlow() {
  const { courseId, examId } = useParams<{ courseId: string; examId: string }>()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [exam, setExam] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Steps: 'info' (instructions) | 'active' (taking exam) | 'success' (completed)
  const [step, setStep] = useState<'info' | 'active' | 'success'>('info')
  const [deadline, setDeadline] = useState<Date | null>(null)
  const [timeLeft, setTimeLeft] = useState<string>('')

  // Student answers state: questionId -> studentAnswer
  const [answers, setAnswers] = useState<Record<number, string>>({})
  
  // UI toggles
  const [showQuestionMap, setShowQuestionMap] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const timerRef = useRef<any>(null)
  const answersRef = useRef(answers)

  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  // Fetch initial exam data
  useEffect(() => {
    const loadExam = async () => {
      if (!examId || !token) return
      try {
        setLoading(true)
        setError(null)
        const id = parseInt(examId, 10)
        if (isNaN(id)) throw new Error('Invalid Exam ID')
        
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

  // Timer logic for active exams
  useEffect(() => {
    if (step === 'active' && deadline) {
      const updateTimer = () => {
        const now = new Date().getTime()
        const dest = new Date(deadline).getTime()
        const diff = dest - now

        if (diff <= 0) {
          setTimeLeft('00:00')
          if (timerRef.current) clearInterval(timerRef.current)
          handleAutoSubmit()
        } else {
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)
          setTimeLeft(
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
          )
        }
      }

      updateTimer()
      timerRef.current = setInterval(updateTimer, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [step, deadline])

  const handleStartExam = async () => {
    if (!token || !examId) return
    try {
      setSubmitting(true)
      setError(null)
      const id = parseInt(examId, 10)
      
      const response = await startExamAttempt(token, id)
      
      if (response.deadline) {
        setDeadline(new Date(response.deadline))
      } else {
        setDeadline(null) // Unlimited duration
      }
      
      setStep('active')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Could not start or resume the exam.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }))
  }

  const getAnsweredCount = () => {
    if (!exam || !exam.questions) return 0
    return exam.questions.filter((q: any) => answers[q.id]?.trim()).length
  }

  const handleManualSubmit = () => {
    setShowConfirmModal(true)
  }

  const executeSubmission = async () => {
    if (!token || !examId || submitting) return
    setSubmitting(true)
    setShowConfirmModal(false)
    
    try {
      const allQuestions = exam.questions || []
      const formattedAnswers = allQuestions.map((q: any) => ({
        questionId: q.id,
        studentAnswer: (answers[q.id] || '').trim()
      }))

      await submitExamAttempt(token, parseInt(examId, 10), formattedAnswers)
      setStep('success')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to submit exam.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAutoSubmit = async () => {
    if (!token || !examId || submitting) return
    setSubmitting(true)
    
    try {
      const allQuestions = exam.questions || []
      const formattedAnswers = allQuestions.map((q: any) => ({
        questionId: q.id,
        studentAnswer: (answersRef.current[q.id] || '').trim()
      }))

      await submitExamAttempt(token, parseInt(examId, 10), formattedAnswers)
      setStep('success')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Auto-submission failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const scrollToQuestion = (idx: number) => {
    const el = document.getElementById(`question-card-${idx}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setShowQuestionMap(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-accent-indigo border-t-transparent animate-spin" />
        <span className="text-sm text-text-secondary">Loading exam details...</span>
      </div>
    )
  }

  if (error && step === 'info') {
    return (
      <div className="max-w-md mx-auto text-center p-12 mt-16 rounded-2xl glass-panel border border-white/[0.04] shadow-xl space-y-6">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-3xl">
          ⚠️
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Assessment Error</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{error}</p>
        </div>
        <button
          onClick={() => navigate(`/student/${courseId}`)}
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
        >
          Back to Course
        </button>
      </div>
    )
  }

  // --- STATE 1: PRE-EXAM SCREEN ---
  if (step === 'info') {
    return (
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-16">
        <header className="mb-8 border-b border-white/[0.04] pb-6">
          <button
            onClick={() => navigate(`/student/${courseId}`)}
            className="text-xs text-text-muted hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer"
          >
            &larr; Cancel and Go Back
          </button>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Exam Instructions
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Please review the details below before starting your assessment.
          </p>
        </header>

        <div className="glass-panel p-8 rounded-2xl border border-white/[0.04] space-y-6 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-text-muted block font-semibold uppercase tracking-wider">Exam Name</span>
              <span className="text-white font-medium">{exam.title}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-text-muted block font-semibold uppercase tracking-wider">Course Name</span>
              <span className="text-white font-medium">{exam.course?.name || 'Loading...'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-text-muted block font-semibold uppercase tracking-wider">Exam ID</span>
              <span className="font-mono text-white">#{exam.id}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-text-muted block font-semibold uppercase tracking-wider">Total Questions</span>
              <span className="text-white font-medium">{exam.totalQuestions} Questions</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-text-muted block font-semibold uppercase tracking-wider">Passing Mark</span>
              <span className="text-white font-medium">{exam.passMark} Points</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-text-muted block font-semibold uppercase tracking-wider">Time Limit</span>
              <span className="text-white font-medium">
                {exam.duration > 0 ? `${exam.duration} Minutes` : 'No time limit'}
              </span>
            </div>
          </div>

          <div className="border-t border-white/[0.04] pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-text-muted block font-semibold uppercase tracking-wider">Student Name</span>
              <span className="text-white font-medium">{exam.studentName}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-text-muted block font-semibold uppercase tracking-wider">Student ID</span>
              <span className="font-mono text-white">#{exam.studentId}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-accent-indigo/5 border border-accent-indigo/10 text-xs text-text-secondary leading-relaxed space-y-2">
            <strong className="text-white block">Important Instructions:</strong>
            <ul className="list-disc pl-4 space-y-1">
              <li>Once you click <strong>Start Exam</strong>, the countdown will begin (if timed).</li>
              <li>If your browser closes accidentally, you can return to this page and click <strong>Start Exam</strong> to resume. The timer will continue counting down from the original deadline.</li>
              <li>If the timer runs out, your exam will be automatically submitted with your current progress.</li>
            </ul>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleStartExam}
              disabled={submitting}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all disabled:opacity-50 cursor-pointer text-center"
            >
              {submitting ? 'Preparing Exam...' : 'Start Exam'}
            </button>
            <button
              onClick={() => navigate(`/student/${courseId}`)}
              className="px-6 py-3 rounded-xl text-sm font-bold text-text-secondary hover:text-white border border-white/10 hover:bg-white/5 transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  // --- STATE 3: SUCCESS PAGE ---
  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto text-center p-12 mt-16 rounded-2xl glass-panel border border-white/[0.04] shadow-xl space-y-6">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-3xl">
          ✓
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Exam Submitted</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Your assessment has been submitted successfully. Your answers are now stored and pending grading by your teacher.
          </p>
        </div>
        <button
          onClick={() => navigate(`/student/${courseId}`)}
          className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all cursor-pointer"
        >
          Return to Course content
        </button>
      </div>
    )
  }

  // --- STATE 2: ACTIVE EXAM SCREEN ---
  return (
    <div className="max-w-4xl mx-auto px-6 pt-24 pb-20 relative">
      {/* Sticky Top Panel */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-bg-primary/95 backdrop-blur-md border-b border-white/[0.04] py-4 shadow-md">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Assessment Exam</span>
            <span className="text-sm font-bold text-white max-w-[200px] md:max-w-md truncate">{exam.title}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Show Progress Toggle Button */}
            <button
              onClick={() => setShowQuestionMap(!showQuestionMap)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                showQuestionMap
                  ? 'bg-accent-indigo/10 border-accent-indigo text-accent-indigo'
                  : 'bg-white/5 border-white/10 text-text-secondary hover:text-white hover:bg-white/10'
              }`}
            >
              Questions ({getAnsweredCount()}/{exam.questions?.length})
            </button>

            {/* Timer */}
            {deadline && (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono font-bold text-white">
                ⏱️ {timeLeft || '--:--'}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleManualSubmit}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all cursor-pointer"
            >
              Submit Exam
            </button>
          </div>
        </div>

        {/* Collapsible Question Navigation Panel */}
        {showQuestionMap && (
          <div className="max-w-4xl mx-auto px-6 mt-4 pt-4 border-t border-white/[0.04] animate-fade-in">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">
              Questions
            </h4>
            <div className="flex flex-wrap gap-3">
              {exam.questions?.map((q: any, idx: number) => {
                const isAnswered = !!answers[q.id]?.trim()
                return (
                  <button
                    key={q.id}
                    onClick={() => scrollToQuestion(idx)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isAnswered
                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                        : 'bg-white/5 border-white/10 text-text-muted hover:border-white/20'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center ${
                      isAnswered ? 'bg-green-400 border-green-400' : 'border-text-muted bg-transparent'
                    }`} />
                    Q{idx + 1}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Questions Content */}
      <main className="space-y-8 mt-4">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-xs text-red-400">
            {error}
          </div>
        )}

        {exam.questions?.map((q: any, idx: number) => (
          <section
            key={q.id}
            id={`question-card-${idx}`}
            className="glass-panel p-8 rounded-2xl border border-white/[0.04] space-y-4 shadow-card scroll-mt-36"
          >
            <div className="flex justify-between items-center pb-3 border-b border-white/[0.04]">
              <span className="text-xs font-bold text-accent-indigo">Question #{idx + 1}</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-text-secondary uppercase">
                {q.marks} Marks
              </span>
            </div>

            <p className="text-sm text-white font-medium leading-relaxed whitespace-pre-wrap">
              {q.questionText}
            </p>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                Your Answer
              </label>
              <textarea
                value={answers[q.id] || ''}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                placeholder="Type your answer here..."
                rows={4}
                className="w-full px-4 py-3.5 rounded-xl bg-bg-secondary border border-white/5 focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-white placeholder-white/25 outline-none transition-all resize-y"
              />
            </div>
          </section>
        ))}
      </main>

      {/* --- STATE 3: SUBMIT CONFIRMATION DIALOG MODAL --- */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl space-y-6">
            <h3 className="text-xl font-bold text-white">Submit Assessment Exam?</h3>
            
            <div className="space-y-4">
              <p className="text-sm text-text-secondary leading-relaxed">
                You have answered <span className="font-bold text-white">{getAnsweredCount()}</span> out of{' '}
                <span className="font-bold text-white">{exam.questions?.length}</span> questions.
              </p>
              
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-text-muted leading-relaxed">
                <strong>Disclaimer:</strong> Once you submit, you will not be able to return to this exam or modify your answers.
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={executeSubmission}
                className="flex-1 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all cursor-pointer"
              >
                Submit Now
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-3 rounded-xl text-xs font-bold text-text-secondary hover:text-white border border-white/10 hover:bg-white/5 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- STATE 4: FULL PAGE LOADING SCREEN DURING SUBMISSION --- */}
      {submitting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/75 backdrop-blur-md">
          <div className="w-12 h-12 rounded-full border-4 border-accent-indigo border-t-transparent animate-spin mb-4" />
          <p className="text-sm font-bold text-white">Submitting your exam assessment...</p>
          <p className="text-xs text-text-muted mt-1">Please do not close this window or reload the page.</p>
        </div>
      )}
    </div>
  )
}
