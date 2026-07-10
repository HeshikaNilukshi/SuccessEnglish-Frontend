import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchUsers, deleteUser } from '@/actions/users'
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal'

export default function AdminTeachersList() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [teachers, setTeachers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadTeachers = async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchUsers(token, 'TEACHER')
      setTeachers(data)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to load teachers.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id)
    setIsModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTargetId || !token) return
    setDeletingId(deleteTargetId)
    try {
      await deleteUser(token, deleteTargetId)
      setTeachers(prev => prev.filter(u => u.id !== deleteTargetId))
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to delete teacher.')
    } finally {
      setDeletingId(null)
      setDeleteTargetId(null)
      setIsModalOpen(false)
    }
  }

  useEffect(() => {
    loadTeachers()
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-primary">
                Manage <span className="gradient-text-accent">Teachers</span>
              </h1>
              <p className="text-text-secondary text-sm md:text-base">
                View, create, update, and delete teacher accounts.
              </p>
            </div>
            <Link
              to="/admin/teachers/new"
              className="relative inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold text-text-primary overflow-hidden rounded-xl transition-all duration-300 active:scale-[0.98] hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] cursor-pointer group/btn"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-accent-indigo to-accent-violet" />
              <span className="relative flex items-center gap-1">
                + Add Teacher
              </span>
            </Link>
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
          <div className="max-w-md mx-auto text-center p-8 rounded-2xl bg-red-500/12 border border-red-500/25 shadow-xl space-y-4">
            <p className="text-sm text-red-900 font-medium">{error}</p>
            <button
              type="button"
              onClick={loadTeachers}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && teachers.length === 0 && (
          <p className="text-center py-12 text-sm text-text-secondary">No teachers found.</p>
        )}

        {!loading && !error && teachers.length > 0 && (
          <div className="relative overflow-hidden rounded-2xl border border-border-subtle glass-panel shadow-xl">
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/25 to-transparent" />
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle bg-black/5">
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-text-secondary">ID</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-text-secondary">Name</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-text-secondary">Email</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-text-secondary text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {teachers.map(teacher => (
                    <tr
                      key={teacher.id}
                      onClick={() => navigate(`/admin/user/${teacher.id}`)}
                      className="hover:bg-black/5 transition-colors duration-150 cursor-pointer"
                    >
                      <td className="p-5 text-sm font-semibold text-text-primary font-mono">{teacher.id}</td>
                      <td className="p-5 text-sm font-bold text-text-primary">{teacher.name}</td>
                      <td className="p-5 text-sm text-text-secondary">{teacher.email}</td>
                      <td className="p-5 text-sm text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteClick(teacher.id)
                          }}
                          disabled={deletingId === teacher.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-900 font-medium hover:text-white bg-red-500/12 border border-red-500/25 hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                        >
                          {deletingId === teacher.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <DeleteConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Teacher?"
        message="Are you sure you want to delete this teacher account? This action cannot be undone."
        confirmText="Yes, Delete"
        isDeleting={deletingId !== null}
      />
    </div>
  )
}
