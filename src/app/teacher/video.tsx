import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchVideoDetails, updateVideo, deleteVideo, fetchUploadSignature, toggleVideoApproval } from '@/actions/courses'
import { createPortal } from 'react-dom'
import { MoreVertical, Pencil, Trash2, ShieldAlert, ShieldCheck } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import PageShell from '@/components/teacher/PageShell'

export default function TeacherVideoPage() {
  const { courseId, videoId } = useParams<{ courseId: string; videoId: string }>()
  const { token } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const basePath = location.pathname.startsWith('/admin') ? '/admin/courses' : '/teacher'

  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editFile, setEditFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [editProgress, setEditProgress] = useState<string | null>(null)
  const [editError, setEditError] = useState<string | null>(null)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [isApprovalOpen, setIsApprovalOpen] = useState(false)
  const [isTogglingApproval, setIsTogglingApproval] = useState(false)

  useEffect(() => {
    const loadVideo = async () => {
      if (!videoId || !token) return
      try {
        setLoading(true)
        setError(null)
        const id = parseInt(videoId, 10)
        if (isNaN(id)) {
          throw new Error('Invalid Video ID')
        }

        const data = await fetchVideoDetails(token, id)
        setVideo(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load video.')
      } finally {
        setLoading(false)
      }
    }

    loadVideo()
  }, [videoId, token])

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !videoId || !video) return

    if (!editTitle.trim()) {
      setEditError('Title is required')
      return
    }

    setIsSaving(true)
    setEditError(null)

    try {
      let updatePayload: { title?: string; videoUrl?: string; publicId?: string } = {
        title: editTitle,
      }

      if (editFile) {
        setEditProgress('Requesting upload signature...')
        const signatureData = await fetchUploadSignature(token)

        setEditProgress('Uploading video to cloud...')
        const formData = new FormData()
        formData.append('file', editFile)
        formData.append('api_key', signatureData.api_key)
        formData.append('timestamp', signatureData.timestamp.toString())
        formData.append('signature', signatureData.signature)
        formData.append('folder', signatureData.folder)

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${signatureData.cloud_name}/video/upload`,
          {
            method: 'POST',
            body: formData,
          }
        )

        if (!cloudRes.ok) {
          throw new Error('Cloudinary upload failed')
        }

        const cloudData = await cloudRes.json()
        updatePayload.videoUrl = cloudData.secure_url
        updatePayload.publicId = cloudData.public_id
      }

      setEditProgress('Saving changes...')
      const updatedVideo = await updateVideo(token, parseInt(videoId, 10), updatePayload)
      setVideo(updatedVideo)
      setIsEditing(false)
    } catch (err: any) {
      console.error(err)
      setEditError(err.message || 'An error occurred while saving.')
    } finally {
      setIsSaving(false)
      setEditProgress(null)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!token || !videoId || !courseId) return
    setIsDeleting(true)
    try {
      await deleteVideo(token, parseInt(videoId, 10))
      setIsDeleteOpen(false)
      navigate(`${basePath}/${courseId}`)
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to delete video.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleApprovalConfirm = async () => {
    if (!token || !videoId || !video) return
    setIsTogglingApproval(true)
    try {
      const newStatus = !video.isAdminApproved
      await toggleVideoApproval(token, parseInt(videoId, 10), newStatus)
      setVideo({ ...video, isAdminApproved: newStatus })
      setIsApprovalOpen(false)
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to update approval status.')
    } finally {
      setIsTogglingApproval(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-10 pb-8 flex flex-col items-stretch">
        <div className="h-4 w-32 bg-black/5 rounded mb-4 animate-pulse" />
        <div className="h-10 w-96 bg-black/5 rounded mb-8 animate-pulse" />
        <div className="w-full aspect-video bg-black/5 rounded-2xl border border-border-subtle shadow-2xl animate-pulse" />
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="max-w-md mx-auto text-center p-12 mt-16 rounded-2xl glass-panel border-border-subtle shadow-xl space-y-6">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-900 font-medium text-3xl">
          ⚠️
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-text-primary">Video Unreachable</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            {error || 'The video you are trying to view is unavailable.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(`${basePath}/${courseId}`)}
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
        >
          Back to Course Content
        </button>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Home', href: basePath },
    { label: 'Course', href: `${basePath}/${courseId}` },
    { label: video.title }
  ]

  const actions = (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-4 py-2 text-xs font-bold text-text-primary rounded-xl bg-black/5 border border-border-subtle hover:bg-black/10 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-1.5 focus:outline-none">
        <MoreVertical className="w-4 h-4" />
        Options
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-bg-secondary border border-border-subtle rounded-2xl shadow-xl p-1.5 animate-popover-in">
        <DropdownMenuItem
          onClick={() => {
            setEditTitle(video.title)
            setEditFile(null)
            setEditError(null)
            setEditProgress(null)
            setIsEditing(true)
          }}
          className="flex items-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-xl text-text-primary hover:bg-black/5 transition-all cursor-pointer outline-none"
        >
          <Pencil className="w-4 h-4 text-text-secondary" />
          Edit Video
        </DropdownMenuItem>
        
        {location.pathname.startsWith('/admin') && (
          <DropdownMenuItem
            onClick={() => setIsApprovalOpen(true)}
            className="flex items-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-xl text-text-primary hover:bg-black/5 transition-all cursor-pointer outline-none"
          >
            {video.isAdminApproved ? (
              <>
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                Remove Approval
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Approve Video
              </>
            )}
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={() => setIsDeleteOpen(true)}
          className="flex items-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-xl text-red-900 hover:bg-red-500/10 transition-all cursor-pointer outline-none"
        >
          <Trash2 className="w-4 h-4 text-red-900" />
          Delete Video
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <PageShell
      title={
        <div className="flex items-center gap-3">
          {video.title}
          {video.isAdminApproved === false && (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs px-2 py-0.5 shadow-sm">
              <ShieldAlert className="w-3 h-3 mr-1 inline" />
              Unapproved
            </Badge>
          )}
        </div>
      }
      subtitle="Lecture video viewer and course content details."
      breadcrumbs={breadcrumbs}
      actions={actions}
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <main className="relative w-full aspect-video rounded-2xl overflow-hidden glass-panel border border-border-subtle shadow-2xl bg-black/60">
          <iframe
            src={video.videoUrl}
            title={video.title}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </main>

        {/* Edit Video Modal */}
        {isEditing && createPortal(
          <>
            <div
              className="fixed inset-0 bg-[#060813]/70 backdrop-blur-md z-50 transition-opacity duration-300 animate-fade-in"
              onClick={() => !isSaving && setIsEditing(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
              <div className="relative w-full max-w-lg rounded-3xl bg-bg-secondary/95 backdrop-blur-xl border border-border-subtle shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 md:p-8 animate-popover-in overflow-hidden">
                <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/25 to-transparent" />
                
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="absolute top-4 right-4 text-text-muted hover:text-text-primary p-2 rounded-full hover:bg-black/5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <h3 className="text-xl font-bold text-text-primary mb-6">Edit Lecture Video</h3>

                <form onSubmit={handleEditSubmit} className="space-y-6">
                  {editError && (
                    <div className="p-4 rounded-xl bg-red-500/12 border border-red-500/25 text-xs text-red-900 font-medium">
                      {editError}
                    </div>
                  )}

                  {editProgress && (
                    <div className="p-4 rounded-xl bg-accent-indigo/5 border border-accent-indigo/10 text-xs text-accent-indigo animate-pulse">
                      {editProgress}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                      Video Title
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/5 border border-border-subtle focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-text-primary placeholder-white/20 outline-none transition-all"
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                      Replace Video File (Optional)
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setEditFile(e.target.files[0])
                        }
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-black/5 border border-border-subtle focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-text-primary outline-none transition-all file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-black/5 file:text-text-primary hover:file:bg-black/5"
                      disabled={isSaving}
                    />
                    <p className="text-[10px] text-text-muted">
                      Leave blank to keep the current video file.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-border-subtle">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                      className="flex-grow py-3 text-sm font-bold text-text-secondary hover:text-text-primary rounded-2xl border border-border-subtle hover:border-border-subtle bg-black/5 hover:bg-black/5 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-grow py-3 text-sm font-bold text-white rounded-2xl bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        ,
          document.body
        )}

        {/* Delete Video Modal */}
        {isDeleteOpen && createPortal(
          <>
            <div
              className="fixed inset-0 bg-[#060813]/70 backdrop-blur-md z-50 transition-opacity duration-300 animate-fade-in"
              onClick={() => !isDeleting && setIsDeleteOpen(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
              <div className="relative w-full max-w-md rounded-3xl bg-bg-secondary/95 backdrop-blur-xl border border-border-subtle shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 md:p-8 animate-popover-in text-center overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/35 to-transparent" />
                <div className="absolute top-[-20%] left-[20%] w-[200px] h-[200px] bg-red-500/8 rounded-full blur-[60px] pointer-events-none" />

                <button
                  type="button"
                  onClick={() => setIsDeleteOpen(false)}
                  disabled={isDeleting}
                  className="absolute top-4 right-4 text-text-muted hover:text-text-primary p-2 rounded-full hover:bg-black/5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="relative w-20 h-20 mx-auto mb-6 rounded-2xl overflow-hidden flex items-center justify-center bg-red-500/10 border border-red-500/20 shadow-lg shadow-red-500/10">
                  <svg className="w-9 h-9 text-red-900 font-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-text-primary mb-1">Delete Video?</h3>
                <p className="text-sm text-text-secondary mb-8 leading-relaxed">
                  Are you sure you want to delete <span className="text-text-primary font-semibold">"{video.title}"</span>? This action is permanent and cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDeleteOpen(false)}
                    disabled={isDeleting}
                    className="flex-1 py-3 text-sm font-bold text-text-secondary hover:text-text-primary rounded-2xl border border-border-subtle hover:border-border-subtle bg-black/5 hover:bg-black/5 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className="flex-1 py-3 text-sm font-bold text-white rounded-2xl bg-red-500/80 hover:bg-red-500 border border-red-500/30 hover:border-red-500/60 transition-all duration-200 active:scale-[0.98] hover:shadow-[0_0_20px_rgba(239,68,68,0.25)] cursor-pointer disabled:opacity-50"
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                </div>
              </div>
            </div>
          </>
        ,
          document.body
        )}

        {/* Approval Modal */}
        {isApprovalOpen && createPortal(
          <>
            <div
              className="fixed inset-0 bg-[#060813]/70 backdrop-blur-md z-50 transition-opacity duration-300 animate-fade-in"
              onClick={() => !isTogglingApproval && setIsApprovalOpen(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
              <div className="relative w-full max-w-md rounded-3xl bg-bg-secondary/95 backdrop-blur-xl border border-border-subtle shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 md:p-8 animate-popover-in text-center overflow-hidden">
                <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${video.isAdminApproved ? 'via-amber-500/35' : 'via-emerald-500/35'} to-transparent`} />
                <div className={`absolute top-[-20%] left-[20%] w-[200px] h-[200px] ${video.isAdminApproved ? 'bg-amber-500/8' : 'bg-emerald-500/8'} rounded-full blur-[60px] pointer-events-none`} />

                <button
                  type="button"
                  onClick={() => setIsApprovalOpen(false)}
                  disabled={isTogglingApproval}
                  className="absolute top-4 right-4 text-text-muted hover:text-text-primary p-2 rounded-full hover:bg-black/5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className={`relative w-20 h-20 mx-auto mb-6 rounded-2xl overflow-hidden flex items-center justify-center ${video.isAdminApproved ? 'bg-amber-500/10 border-amber-500/20 shadow-amber-500/10 text-amber-600' : 'bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10 text-emerald-600'} border shadow-lg`}>
                  {video.isAdminApproved ? <ShieldAlert className="w-9 h-9" /> : <ShieldCheck className="w-9 h-9" />}
                </div>

                <h3 className="text-xl font-bold text-text-primary mb-1">
                  {video.isAdminApproved ? 'Remove Approval?' : 'Approve Video?'}
                </h3>
                <p className="text-sm text-text-secondary mb-8 leading-relaxed">
                  {video.isAdminApproved 
                    ? `Are you sure you want to remove approval for "${video.title}"? It will be hidden from students.` 
                    : `Are you sure you want to approve "${video.title}"? It will become visible to enrolled students.`}
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsApprovalOpen(false)}
                    disabled={isTogglingApproval}
                    className="flex-1 py-3 text-sm font-bold text-text-secondary hover:text-text-primary rounded-2xl border border-border-subtle hover:border-border-subtle bg-black/5 hover:bg-black/5 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleApprovalConfirm}
                    disabled={isTogglingApproval}
                    className={`flex-1 py-3 text-sm font-bold text-white rounded-2xl transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50 ${
                      video.isAdminApproved 
                        ? 'bg-amber-600 hover:bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]' 
                        : 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                    }`}
                  >
                    {isTogglingApproval ? 'Processing...' : 'Yes, Confirm'}
                  </button>
                </div>
              </div>
            </div>
          </>
        ,
          document.body
        )}
      </div>
    </PageShell>
  )
}
