import { useState, useEffect } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchCourse, fetchVideoDetails } from '@/actions/courses'
import { fetchMaterialsByVideo, deleteMaterial } from '@/actions/materials'
import PageShell from '@/components/teacher/PageShell'
import { EmptyState } from '@/components/ui/EmptyState'
import { AddMaterialModal } from '@/components/ui/AddMaterialModal'
import { formatDate } from '@/lib/utils'
import { MoreVertical, Trash2, Download } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { createPortal } from 'react-dom'

export default function TeacherVideoMaterials() {
  const { courseId, videoId } = useParams<{ courseId: string; videoId: string }>()
  const { token } = useAuth()
  const location = useLocation()
  const basePath = location.pathname.startsWith('/admin') ? '/admin/courses' : '/teacher'

  const [course, setCourse] = useState<Course | null>(null)
  const [video, setVideo] = useState<Video | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false)

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadContent = async () => {
    if (!courseId || !videoId || !token) return
    try {
      setLoading(true)
      setError(null)
      const cId = parseInt(courseId, 10)
      const vId = parseInt(videoId, 10)
      if (isNaN(cId) || isNaN(vId)) throw new Error('Invalid IDs')

      const [courseData, videoData, materialsData] = await Promise.all([
        fetchCourse(cId, token),
        fetchVideoDetails(token, vId),
        fetchMaterialsByVideo(token, vId),
      ])

      setCourse(courseData)
      setVideo(videoData)
      setMaterials(materialsData)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to load materials.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContent()
  }, [courseId, videoId, token])

  const handleDeleteConfirm = async () => {
    if (!token || deleteTargetId === null) return
    setIsDeleting(true)
    try {
      await deleteMaterial(token, deleteTargetId)
      setDeleteTargetId(null)
      loadContent()
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to delete material.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-8">
        <header className="mb-6">
          <div className="h-4 w-32 bg-black/5 rounded mb-4 animate-pulse" />
          <div className="h-10 w-80 bg-black/5 rounded mb-3 animate-pulse" />
        </header>
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-black/5 rounded-2xl border border-border-subtle p-5 flex items-center justify-between animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !course || !video) {
    return (
      <div className="max-w-md mx-auto text-center p-12 mt-16 rounded-2xl glass-panel border-border-subtle shadow-xl space-y-6">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-900 font-medium text-3xl">
          ⚠️
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">{error || 'Materials unavailable.'}</p>
        <Link
          to={`${basePath}/${courseId}`}
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
        >
          Back to Course
        </Link>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Home', href: basePath },
    { label: course.name, href: `${basePath}/${course.id}` },
    { label: 'Videos', href: `${basePath}/${course.id}/videos` },
    { label: video.title, href: `${basePath}/${course.id}/videos/${video.id}` },
    { label: 'Materials' }
  ]

  const headerActions = (
    <button
      type="button"
      onClick={() => setIsAddMaterialOpen(true)}
      className="relative inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold text-white overflow-hidden rounded-xl transition-all duration-300 active:scale-[0.98] hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] cursor-pointer group/btn whitespace-nowrap shrink-0"
    >
      <span className="absolute inset-0 bg-gradient-to-r from-accent-indigo to-accent-violet" />
      <span className="relative flex items-center gap-1.5">
        + Add Material
      </span>
    </button>
  )

  return (
    <PageShell
      title={`${video.title} - Materials`}
      subtitle="Manage downloadable resources for this lecture."
      breadcrumbs={breadcrumbs}
      actions={headerActions}
    >
      <div className="flex-grow flex flex-col">
        {materials.length === 0 ? (
          <EmptyState
            icon="📄"
            title="No Materials Uploaded"
            description="Add a downloadable document or PDF using the action button above."
          />
        ) : (
          <div className="flex flex-col gap-4 animate-fade-in-up">
            {materials.map((material) => (
              <div
                key={material.id}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl glass-panel glass-panel-hover p-5 text-left transition-all duration-300 hover:shadow-lg"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent-indigo to-accent-violet rounded-l-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center gap-4 flex-grow">
                  <div className="w-12 h-12 rounded-xl bg-black/5 border border-border-subtle flex items-center justify-center text-xl shrink-0 group-hover:bg-accent-indigo/10 group-hover:border-accent-indigo/30 transition-all duration-300">
                    📄
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-text-primary tracking-tight group-hover:text-accent-indigo transition-colors duration-300">
                      {material.name}
                    </h3>
                    <p className="text-[11px] text-text-muted font-medium">
                      Uploaded {formatDate(material.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/[0.04]">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 rounded-xl hover:bg-black/5 text-text-muted hover:text-text-primary transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl glass-panel border-border-subtle bg-bg-secondary/95 backdrop-blur-xl shadow-2xl">
                      <DropdownMenuItem 
                        onClick={() => window.open(material.url, '_blank')}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-black/5 cursor-pointer text-text-primary"
                      >
                        <Download className="w-4 h-4 text-accent-indigo" />
                        Download
                      </DropdownMenuItem>
                      <div className="h-px bg-white/[0.04] my-1 mx-2" />
                      <DropdownMenuItem 
                        onClick={() => setDeleteTargetId(material.id)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-red-500/10 hover:text-red-600 cursor-pointer text-text-primary"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                        Delete Material
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddMaterialModal
        isOpen={isAddMaterialOpen}
        onClose={() => setIsAddMaterialOpen(false)}
        videoId={video.id.toString()}
        token={token ?? ''}
        onSuccess={loadContent}
      />

      {deleteTargetId && createPortal(
        <>
          <div className="fixed inset-0 bg-[#060813]/70 backdrop-blur-md z-50 animate-fade-in" onClick={() => setDeleteTargetId(null)} />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-sm rounded-3xl bg-bg-secondary border border-border-subtle p-6 animate-popover-in text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Delete Material?</h3>
              <p className="text-sm text-text-muted mb-6">
                Are you sure you want to delete this material? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(null)}
                  disabled={isDeleting}
                  className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-black/5 hover:bg-black/10 text-text-secondary transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25 transition-all"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </PageShell>
  )
}
