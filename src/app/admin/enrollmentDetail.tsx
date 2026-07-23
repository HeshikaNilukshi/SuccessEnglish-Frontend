import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchEnrollmentById, verifyEnrollment } from '@/actions/enrollments'
import { formatDate, formatPrice } from '@/lib/utils'
import PageShell from '@/components/teacher/PageShell'

const pageTitle = (
  <>
    Enrollment <span className="gradient-text-accent">Verification</span>
  </>
)

export default function AdminEnrollmentDetail() {
  const { id } = useParams<{ id: string }>()
  const { token } = useAuth()
  const [enrollment, setEnrollment] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const loadEnrollment = async () => {
    if (!id || !token) return
    try {
      setLoading(true)
      setError(null)
      const enrollmentId = parseInt(id, 10)
      if (isNaN(enrollmentId)) {
        throw new Error('Invalid Enrollment ID')
      }
      const data = await fetchEnrollmentById(token, enrollmentId)
      if (!data) {
        throw new Error('Enrollment request not found.')
      }
      setEnrollment(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load enrollment details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEnrollment()
  }, [id, token])

  const handleVerifyToggle = async (verifyStatus: boolean) => {
    if (!token || !enrollment) return

    try {
      setSubmitting(true)
      setSubmitError(null)
      const updated = await verifyEnrollment(token, enrollment.id, verifyStatus)
      setEnrollment((prev: any) => (prev ? { ...prev, verified: updated.verified } : null))
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to update enrollment status')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-8 animate-pulse">
        <div className="h-4 w-32 bg-black/5 rounded mb-4" />
        <div className="h-10 w-64 bg-black/5 rounded mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 h-[350px] bg-black/5 rounded-2xl" />
          <div className="lg:col-span-7 h-[350px] bg-black/5 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error || !enrollment) {
    return (
      <div className="max-w-md mx-auto text-center p-12 mt-16 rounded-2xl glass-panel border-border-subtle shadow-xl space-y-6">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-900 font-medium text-3xl">
          ⚠️
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-text-primary">Enrollment Not Found</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            {error || 'The enrollment you are looking for does not exist or has been removed.'}
          </p>
        </div>
        <Link
          to="/admin/enrollments"
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
        >
          Return to Enrollments
        </Link>
      </div>
    )
  }

  const { course, user: student, verified, receiptUrl, createdAt } = enrollment

  const breadcrumbs = [
    { label: 'Home', href: '/admin' },
    { label: 'Verify Enrollments', href: '/admin/enrollments' },
    { label: `Enrollment #${enrollment.id}` }
  ]

  return (
    <PageShell
      title={pageTitle}
      subtitle={`Verify enrollment request details and verify payment receipt.`}
      breadcrumbs={breadcrumbs}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fade-in-up">
        {/* Left Column: Details */}
        <div className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-2xl glass-panel border border-border-subtle p-8 shadow-xl h-full flex flex-col justify-between group">
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/25 to-transparent" />
            <div className="space-y-10">
              {/* Course Block */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent-indigo">Course</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight leading-tight">{course.name}</h3>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/5 border border-border-subtle">
                  <span className="text-xs font-mono font-bold text-text-secondary uppercase">Course ID</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-indigo" />
                  <span className="text-xs font-mono font-bold select-all">#{course.id}</span>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-white/[0.06] to-transparent" />

              {/* Student Block */}
              <div className="space-y-5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent-violet">Student Info</span>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center text-white font-black text-lg uppercase shrink-0 shadow-lg shadow-accent-indigo/15">
                    {student.name?.charAt(0) ?? 'U'}
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg md:text-xl font-bold text-text-primary leading-tight">{student.name}</p>
                    <p className="text-xs md:text-sm text-text-muted">{student.email}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 pt-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/5 border border-border-subtle w-fit">
                    <span className="text-xs font-mono font-bold text-text-secondary uppercase">Student ID</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-violet" />
                    <span className="text-xs font-mono font-bold select-all">#{student.id}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/5 border border-border-subtle w-fit">
                    <span className="text-xs font-mono font-bold text-text-secondary uppercase">Submitted</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="text-xs font-mono font-bold">{formatDate(createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom section: Price and Status */}
            <div className="mt-10 pt-8 border-t border-border-subtle space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-text-secondary">Amount Required</h2>
                  <div className="text-2xl md:text-4xl font-black text-text-primary tracking-tight">
                    {formatPrice(course.price)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Receipt Image & Confirm / Unverify Actions */}
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-2xl glass-panel border border-border-subtle p-8 shadow-xl h-full flex flex-col justify-between group">
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-violet/25 to-transparent" />
            
            <div className="flex-grow flex flex-col min-h-0">
              <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Submitted Payment Receipt</h2>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                Review the transfer/deposit receipt image below to verify the student's transaction.
              </p>

              <div className="relative flex-grow flex items-center justify-center border border-border-subtle rounded-2xl p-4 bg-black/40 min-h-[300px] overflow-hidden">
                {receiptUrl ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <img
                      src={receiptUrl}
                      alt="Submitted Receipt"
                      className="max-w-full max-h-[450px] object-contain rounded-lg shadow-lg"
                    />
                  </div>
                ) : (
                  <div className="text-center py-12 text-sm text-text-secondary">
                    No receipt image was submitted for this enrollment request.
                  </div>
                )}
              </div>
            </div>

            {submitError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-900 font-medium text-xs px-4 py-3 rounded-xl mt-4 shrink-0">
                {submitError}
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-border-subtle flex items-center justify-between gap-4 shrink-0">
              {verified ? (
                <>
                  <button
                    onClick={() => handleVerifyToggle(false)}
                    disabled={submitting}
                    className="py-3.5 px-6 rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary bg-black/5 hover:bg-black/10 border border-border-subtle hover:border-border-hover transition-all cursor-pointer select-none active:scale-[0.99] disabled:opacity-50"
                  >
                    Mark as Pending
                  </button>
                  <button
                    type="button"
                    className="py-3.5 px-8 rounded-xl text-xs font-bold text-accent-indigo bg-accent-indigo/10 border border-accent-indigo/20 cursor-default select-none"
                  >
                    ✓ Payment Verified
                  </button>
                </>
              ) : (
                <>
                  <div />
                  <button
                    onClick={() => handleVerifyToggle(true)}
                    disabled={submitting}
                    className="py-3.5 px-8 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all cursor-pointer select-none active:scale-[0.99] disabled:opacity-50"
                  >
                    {submitting ? 'Approving Request...' : 'Confirm & Approve'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
