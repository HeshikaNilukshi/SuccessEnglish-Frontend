import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchUserById, deleteUser } from '@/actions/users'
import CourseCard from '@/components/ui/CourseCard'
import PageShell from '@/components/teacher/PageShell'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'

export default function AdminTeacherDashboard() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token } = useAuth()
  
  const [teacher, setTeacher] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const loadTeacherData = async () => {
    if (!token || !id) return
    setLoading(true)
    setError(null)
    try {
      const teacherId = parseInt(id, 10)
      if (isNaN(teacherId)) {
        throw new Error('Invalid Teacher ID')
      }
      const data = await fetchUserById(token, teacherId)
      if (data.role !== 'TEACHER') {
        throw new Error('User is not a teacher')
      }
      setTeacher(data)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to load teacher dashboard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeacherData()
  }, [id, token])

  const handleDeleteAccount = async () => {
    if (!token || !id) return
    setDeleting(true)
    setDeleteError(null)
    try {
      const teacherId = parseInt(id, 10)
      await deleteUser(token, teacherId)
      setIsDeleteModalOpen(false)
      navigate('/admin/teachers')
    } catch (err: any) {
      console.error(err)
      setDeleteError(err.message || 'Failed to delete teacher account.')
    } finally {
      setDeleting(false)
    }
  }

  const pageTitle = teacher ? (
    <>
      <span className="gradient-text-accent">{teacher.name}</span>'s Dashboard
    </>
  ) : (
    'Teacher Dashboard'
  )

  const breadcrumbs = [
    { label: 'Home', href: '/admin' },
    { label: 'Teachers', href: '/admin/teachers' },
    { label: teacher?.name || 'Dashboard' }
  ]

  const dropdownMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white/90 hover:text-white hover:bg-white/20 transition-all cursor-pointer focus:outline-none flex items-center justify-center shadow-sm">
        <MoreVertical className="w-5 h-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-bg-secondary border border-border-subtle rounded-2xl shadow-xl p-1.5 animate-popover-in">
        <Link
          to={`/admin/user/${id}/edit`}
          className="w-full"
        >
          <DropdownMenuItem
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl text-text-primary hover:bg-black/5 transition-all cursor-pointer outline-none w-full"
          >
            <Pencil className="w-4 h-4 text-text-secondary" />
            Edit Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          onClick={() => setIsDeleteModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl text-red-900 hover:bg-red-500/10 transition-all cursor-pointer outline-none w-full"
        >
          <Trash2 className="w-4 h-4 text-red-900" />
          Delete Account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <>
      <PageShell
        title={pageTitle}
        subtitle={teacher ? `Manage courses, content, and exams for ${teacher.name} (${teacher.email}).` : 'Loading...'}
        breadcrumbs={breadcrumbs}
        actions={teacher ? dropdownMenu : undefined}
      >
        <div className="flex-grow flex flex-col space-y-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
              Teacher's Courses
            </h2>
          </div>

          {loading && (
            <div className="flex flex-col gap-5 w-full">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-2xl bg-bg-secondary/60 border border-border-subtle p-6 h-28 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-5 flex-grow">
                    <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
                    <div className="space-y-2 flex-grow max-w-xl">
                      <Skeleton className="h-5 w-1/3 rounded" />
                      <Skeleton className="h-4 w-full rounded" />
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="space-y-1.5 flex flex-col items-end">
                      <Skeleton className="h-3 w-16 rounded" />
                      <Skeleton className="h-4 w-20 rounded" />
                    </div>
                    <Skeleton className="w-10 h-10 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="max-w-md mx-auto text-center p-8 rounded-2xl bg-red-500/12 border border-red-500/25 space-y-4">
              <p className="text-sm text-red-900 font-medium">{error}</p>
              <button
                type="button"
                onClick={loadTeacherData}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && (!teacher?.createdCourses || teacher.createdCourses.length === 0) && (
            <EmptyState
              icon="📚"
              title="No Courses Found"
              description="This teacher has not registered any courses yet."
            />
          )}

          {!loading && !error && teacher?.createdCourses && teacher.createdCourses.length > 0 && (
            <div className="flex flex-col gap-5 w-full">
              {teacher.createdCourses.map((course: any, idx: number) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  index={idx}
                  to={`/admin/courses/${course.id}`}
                />
              ))}
            </div>
          )}
        </div>
      </PageShell>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && createPortal(
        <>
          <div
            className="fixed inset-0 bg-[#060813]/70 backdrop-blur-md z-50 transition-opacity duration-300 animate-fade-in"
            onClick={() => !deleting && setIsDeleteModalOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="relative w-full max-w-md rounded-3xl bg-bg-secondary/95 backdrop-blur-xl border border-border-subtle shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 md:p-8 animate-popover-in overflow-hidden">
              <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
              
              <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                ⚠️ Delete Teacher Account?
              </h3>
              
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                Are you sure you want to delete <span className="font-bold text-text-primary">{teacher?.name}</span>? This action is permanent, and will delete their profile and restrict their access.
              </p>

              {deleteError && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/12 border border-red-500/25 text-xs text-red-900 font-medium">
                  {deleteError}
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={deleting}
                  className="flex-grow py-3 text-sm font-bold text-text-secondary hover:text-text-primary rounded-2xl border border-border-subtle hover:border-border-subtle bg-black/5 hover:bg-black/5 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex-grow py-3 text-sm font-bold text-white rounded-2xl bg-red-650 hover:bg-red-700 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  )
}
