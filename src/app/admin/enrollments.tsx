import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchAllEnrollments } from '@/actions/enrollments'
import { formatDate } from '@/utils/format-datetime'

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
    <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-12">
      <header className="relative z-20 flex flex-col gap-4 mb-10 border-b border-border-subtle pb-6 animate-fade-in-up">
        <div>
          <Link
            to="/admin"
            className="text-xs text-text-muted hover:text-text-primary transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer"
          >
            &larr; Back to Dashboard
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-primary">
              Verify <span className="gradient-text-accent">Enrollments</span>
            </h1>
            <p className="text-text-secondary text-sm md:text-base">
              Verify student payments and receipts to approve course access.
            </p>
          </div>
        </div>
      </header>

      <main className="animate-fade-in-up animate-delay-100">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-accent-indigo border-t-transparent animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="max-w-md mx-auto text-center p-8 rounded-2xl bg-red-500/5 border border-red-500/10 shadow-xl space-y-4">
            <p className="text-sm text-red-400">{error}</p>
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
          <p className="text-center py-12 text-sm text-text-secondary">No enrollments or payment requests found.</p>
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
                        <span className={`inline-block text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${
                          enrollment.verified 
                             ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
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
      </main>
    </div>
  )
}
