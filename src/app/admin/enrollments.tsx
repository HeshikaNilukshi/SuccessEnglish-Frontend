import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchAllEnrollments } from '@/actions/enrollments'
import { formatDate } from '@/lib/utils'
import PageShell from '@/components/teacher/PageShell'
import { EmptyState } from '@/components/ui/EmptyState'

const pageTitle = (
  <>
    Verify <span className="gradient-text-accent">Enrollments</span>
  </>
)

const breadcrumbs = [
  { label: 'Home', href: '/admin' },
  { label: 'Verify Enrollments' }
]

export default function AdminEnrollments() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadEnrollments = async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAllEnrollments(token)
      setEnrollments(data)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to load enrollments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEnrollments()
  }, [token])

  return (
    <PageShell
      title={pageTitle}
      subtitle="Verify student payments and receipts to approve course access."
      breadcrumbs={breadcrumbs}
    >
      <div className="flex-grow flex flex-col animate-fade-in-up">
        {loading && (
          <div className="flex justify-center items-center py-20 flex-grow">
            <div className="w-8 h-8 rounded-full border-2 border-accent-indigo border-t-transparent animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="max-w-md mx-auto text-center p-8 rounded-2xl bg-red-500/12 border border-red-500/25 shadow-xl space-y-4 my-auto">
            <p className="text-sm text-red-900 font-medium">{error}</p>
            <button
              type="button"
              onClick={loadEnrollments}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && enrollments.length === 0 && (
          <EmptyState
            icon="💳"
            title="No Enrollments Found"
            description="No enrollments or payment requests found in the platform."
          />
        )}

        {!loading && !error && enrollments.length > 0 && (
          <div className="relative overflow-hidden rounded-2xl border border-border-subtle glass-panel shadow-xl">
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/25 to-transparent" />
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle bg-black/5">
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-text-secondary">Enrollment ID</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-text-secondary">Student</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-text-secondary">Course</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-text-secondary">Date Requested</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-text-secondary text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {enrollments.map(enrollment => (
                    <tr
                      key={enrollment.id}
                      onClick={() => navigate(`/admin/enrollments/${enrollment.id}`)}
                      className="hover:bg-black/5 transition-colors duration-150 cursor-pointer"
                    >
                      <td className="p-5 text-sm font-semibold text-text-primary font-mono">
                        #{enrollment.id}
                      </td>
                      <td className="p-5 text-sm">
                        <div className="font-bold text-text-primary">{enrollment.user.name}</div>
                        <div className="text-xs text-text-secondary">{enrollment.user.email}</div>
                      </td>
                      <td className="p-5 text-sm text-text-primary font-medium">{enrollment.course.name}</td>
                      <td className="p-5 text-sm text-text-muted">{formatDate(enrollment.createdAt)}</td>
                      <td className="p-5 text-sm text-right">
                        <span className={`inline-block text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${enrollment.verified
                            ? 'bg-emerald-500/10 text-emerald-900 font-medium border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                          {enrollment.verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  )
}
