import { useState } from 'react'
import { createPortal } from 'react-dom'
import { fetchUploadSignature, saveVideoDetails } from '@/actions/courses'

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  token: string;
  onSuccess: (video: any) => void;
}

export function AddVideoModal({ isOpen, onClose, courseId, token, onSuccess }: AddVideoModalProps) {
  const [newVideoTitle, setNewVideoTitle] = useState('')
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null)
  const [isSavingVideo, setIsSavingVideo] = useState(false)
  const [addVideoProgress, setAddVideoProgress] = useState<string | null>(null)
  const [addVideoError, setAddVideoError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleAddVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !courseId) return

    if (!newVideoTitle.trim()) {
      setAddVideoError('Title is required')
      return
    }

    if (!newVideoFile) {
      setAddVideoError('Please select a video file')
      return
    }

    setIsSavingVideo(true)
    setAddVideoError(null)
    setAddVideoProgress('Requesting upload signature...')

    try {
      const signatureData = await fetchUploadSignature(token)

      setAddVideoProgress('Uploading video to cloud...')
      const formData = new FormData()
      formData.append('file', newVideoFile)
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

      setAddVideoProgress('Saving video details...')
      const newVideo = await saveVideoDetails(token, {
        courseId: parseInt(courseId, 10),
        title: newVideoTitle,
        videoUrl: cloudData.secure_url,
        publicId: cloudData.public_id,
      })

      onSuccess(newVideo)
      setNewVideoTitle('')
      setNewVideoFile(null)
      onClose()
    } catch (err: any) {
      console.error(err)
      setAddVideoError(err.message || 'An error occurred during upload.')
    } finally {
      setIsSavingVideo(false)
      setAddVideoProgress(null)
    }
  }

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-[#060813]/70 backdrop-blur-md z-50 transition-opacity duration-300 animate-fade-in"
        onClick={() => !isSavingVideo && onClose()}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="relative w-full max-w-lg rounded-3xl bg-bg-secondary/95 backdrop-blur-xl border border-border-subtle shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 md:p-8 animate-popover-in overflow-hidden">
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/25 to-transparent" />
          
          <button
            type="button"
            onClick={() => onClose()}
            disabled={isSavingVideo}
            className="absolute top-4 right-4 text-text-muted hover:text-text-primary p-2 rounded-full hover:bg-black/5 transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h3 className="text-xl font-bold text-text-primary mb-6">Upload Lecture Video</h3>

          <form onSubmit={handleAddVideoSubmit} className="space-y-6">
            {addVideoError && (
              <div className="p-4 rounded-xl bg-red-500/12 border border-red-500/25 text-xs text-red-900 font-medium">
                {addVideoError}
              </div>
            )}

            {addVideoProgress && (
              <div className="p-4 rounded-xl bg-accent-indigo/5 border border-accent-indigo/10 text-xs text-accent-indigo animate-pulse">
                {addVideoProgress}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                Video Title
              </label>
              <input
                type="text"
                value={newVideoTitle}
                onChange={(e) => setNewVideoTitle(e.target.value)}
                placeholder="e.g., Lesson 1: Present Perfect Tense"
                className="w-full px-4 py-3 rounded-xl bg-black/5 border border-border-subtle focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-text-primary placeholder-white/20 outline-none transition-all"
                disabled={isSavingVideo}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                Video File
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setNewVideoFile(e.target.files[0])
                  }
                }}
                className="w-full px-4 py-3 rounded-xl bg-black/5 border border-border-subtle focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-text-primary outline-none transition-all file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-black/5 file:text-text-primary hover:file:bg-black/5"
                disabled={isSavingVideo}
                required
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => onClose()}
                disabled={isSavingVideo}
                className="flex-grow py-3 text-sm font-bold text-text-secondary hover:text-text-primary rounded-2xl border border-border-subtle hover:border-border-subtle bg-black/5 hover:bg-black/5 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingVideo}
                className="flex-grow py-3 text-sm font-bold text-white rounded-2xl bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {isSavingVideo ? 'Uploading...' : 'Upload Video'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.body
  )
}
