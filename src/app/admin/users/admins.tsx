import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchUsers } from '@/actions/users'
import { formatDate } from '@/lib/utils'
import { UserRoundPlus } from 'lucide-react'
import PageShell from '@/components/teacher/PageShell'
import { SearchInput } from '@/components/ui/SearchInput'
import { EmptyState } from '@/components/ui/EmptyState'

export default function AdminAdminsList() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [admins, setAdmins] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAdmins = async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchUsers(token, 'ADMIN')
      setAdmins(data)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to load administrators.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdmins()
  }, [token])

  const pageTitle = (
    <>
      Manage <span className="gradient-text-accent">Admins</span>
    </>
  )

  const breadcrumbs = [
    { label: 'Home', href: '/admin' },
    { label: 'Manage Admins' }
  ]

  return (
    <PageShell
      title={pageTitle}
      subtitle="View, create, update, and delete admin accounts."
      breadcrumbs={breadcrumbs}
    >
      <div className="flex-grow flex flex-col animate-fade-in-up">
        <div className="flex w-full gap-4 mb-6">
          <div className="flex-grow">
            <SearchInput placeholder="Search admins..." />
          </div>
          <Link
            to="/admin/admins/new"
            className="relative inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold text-white overflow-hidden rounded-xl transition-all duration-300 active:scale-[0.98] hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] cursor-pointer group/btn whitespace-nowrap shrink-0"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-accent-indigo to-accent-violet" />
            <span className="relative flex items-center gap-1.5">
              <UserRoundPlus className="h-4 w-4" /> Add Admin
            </span>
          </Link>
        </div>
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
              onClick={loadAdmins}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && admins.length === 0 && (
          <EmptyState
            icon="🛡️"
            title="No Administrators Found"
            description="There are currently no administrators registered."
          />
        )}

        {!loading && !error && admins.length > 0 && (
          <div className="relative overflow-hidden rounded-2xl border border-border-subtle glass-panel shadow-xl">
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/25 to-transparent" />
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle bg-black/5">
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-text-secondary">ID</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-text-secondary">Name</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-text-secondary">Email</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-text-secondary">Date Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {admins.map(admin => (
                    <tr
                      key={admin.id}
                      onClick={() => navigate(`/admin/user/${admin.id}`)}
                      className="hover:bg-black/5 transition-colors duration-150 cursor-pointer"
                    >
                      <td className="p-5 text-sm font-semibold text-text-primary font-mono">{admin.id}</td>
                      <td className="p-5 text-sm font-bold text-text-primary">{admin.name}</td>
                      <td className="p-5 text-sm text-text-secondary">{admin.email}</td>
                      <td className="p-5 text-sm text-text-secondary">{formatDate(admin.createdAt!)}</td>
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
