import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchVideoDetails, updateVideo, deleteVideo, fetchUploadSignature } from '@/actions/courses'
import { createPortal } from 'react-dom'

export default function TeacherVideoPage() {
  const { courseId, videoId } = useParams<{ courseId: string; videoId: string }>()
  const { token } = useAuth()
  const navigate = useNavigate()

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
      navigate(`/teacher/${courseId}`)
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to delete video.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-10 pb-8 animate-pulse flex flex-col items-stretch">
        <div className="h-4 w-32 bg-white/5 rounded mb-4" />
        <div className="h-10 w-96 bg-white/5 rounded mb-8" />
        <div className="w-full aspect-video bg-white/5 rounded-2xl border border-white/[0.04] shadow-2xl" />
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="max-w-md mx-auto text-center p-12 mt-16 rounded-2xl glass-panel border-white/[0.04] shadow-xl space-y-6">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-3xl">
          ⚠️
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Video Unreachable</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            {error || 'The video you are trying to view is unavailable.'}
          </p>
        </div>
        <Link
          to={`/teacher/${courseId}`}
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
        >
          Back to Course Content
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 pt-10 pb-16 flex flex-col">
      <header className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            to={`/teacher/${courseId}`}
            className="text-xs text-text-muted hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer"
          >
            &larr; Back to Course Content
          </Link>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
            {video.title}
          </h1>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={() => {
              setEditTitle(video.title)
              setEditFile(null)
              setEditError(null)
              setEditProgress(null)
              setIsEditing(true)
            }}
            className="px-4 py-2 text-xs font-bold text-white rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            ✏️ Edit Video
          </button>
          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            🗑️ Delete Video
          </button>
        </div>
      </header>

      <main className="relative w-full flex justify-center items-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-accent-indigo/10 via-accent-violet/5 to-accent-pink/5 rounded-2xl blur-3xl opacity-50 -z-10" />

        <div className="w-full aspect-video rounded-2xl overflow-hidden glass-panel border border-white/[0.06] shadow-2xl relative bg-black/60">
          <iframe
            src={video.videoUrl}
            title={video.title}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </main>

      {/* Edit Video Modal */}
      {isEditing && createPortal(
        <>
          <div
            className="fixed inset-0 bg-[#060813]/70 backdrop-blur-md z-50 transition-opacity duration-300 animate-fade-in"
            onClick={() => !isSaving && setIsEditing(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="relative w-full max-w-lg rounded-3xl bg-bg-secondary/95 backdrop-blur-xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 md:p-8 animate-popover-in overflow-hidden">
              <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/25 to-transparent" />
              
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="absolute top-4 right-4 text-text-muted hover:text-white p-2 rounded-full hover:bg-white/[0.04] transition-all cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h3 className="text-xl font-bold text-white mb-6">Edit Lecture Video</h3>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                {editError && (
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-xs text-red-400">
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
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-white placeholder-white/20 outline-none transition-all"
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
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-white outline-none transition-all file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white/5 file:text-white hover:file:bg-white/10"
                    disabled={isSaving}
                  />
                  <p className="text-[10px] text-text-muted">
                    Leave blank to keep the current video file.
                  </p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/[0.04]">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="flex-grow py-3 text-sm font-bold text-text-secondary hover:text-white rounded-2xl border border-white/[0.07] hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
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
        </>,
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
            <div className="relative w-full max-w-md rounded-3xl bg-bg-secondary/95 backdrop-blur-xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 md:p-8 animate-popover-in text-center overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/35 to-transparent" />
              <div className="absolute top-[-20%] left-[20%] w-[200px] h-[200px] bg-red-500/8 rounded-full blur-[60px] pointer-events-none" />

              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                disabled={isDeleting}
                className="absolute top-4 right-4 text-text-muted hover:text-white p-2 rounded-full hover:bg-white/[0.04] transition-all cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="relative w-20 h-20 mx-auto mb-6 rounded-2xl overflow-hidden flex items-center justify-center bg-red-500/10 border border-red-500/20 shadow-lg shadow-red-500/10">
                <svg className="w-9 h-9 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">Delete Video?</h3>
              <p className="text-sm text-text-secondary mb-8 leading-relaxed">
                Are you sure you want to delete <span className="text-white font-semibold">"{video.title}"</span>? This action is permanent and cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 py-3 text-sm font-bold text-text-secondary hover:text-white rounded-2xl border border-white/[0.07] hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
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
        </>,
        document.body
      )}
    </div>
  )
}
