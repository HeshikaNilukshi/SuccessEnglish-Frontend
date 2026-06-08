import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchUploadSignature, saveVideoDetails } from '@/actions/courses'

export default function CreateVideo() {
  const { courseId } = useParams<{ courseId: string }>()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !courseId) return

    if (!title.trim()) {
      setError('Video title is required')
      return
    }

    if (!file) {
      setError('Please select a video file')
      return
    }

    setSubmitting(true)
    setError(null)
    setProgress('Requesting upload signature...')

    try {
      const signatureData = await fetchUploadSignature(token)

      setProgress('Uploading video to cloud...')
      const formData = new FormData()
      formData.append('file', file)
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

      setProgress('Saving video details...')
      await saveVideoDetails(token, {
        courseId: parseInt(courseId, 10),
        title,
        videoUrl: cloudData.secure_url,
        publicId: cloudData.public_id,
      })

      navigate(`/teacher/${courseId}`)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An error occurred during upload.')
      setProgress(null)
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-6 pt-16 pb-16">
      <header className="mb-10 border-b border-white/[0.04] pb-6">
        <Link
          to={`/teacher/${courseId}`}
          className="text-xs text-text-muted hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer"
        >
          &larr; Back to Course
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Upload Lecture Video
        </h1>
        <p className="text-text-secondary text-sm">
          Select a video file and name it to publish.
        </p>
      </header>

      <main className="glass-panel p-8 rounded-2xl border border-white/[0.04] relative">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-xs text-red-400">
              {error}
            </div>
          )}

          {progress && (
            <div className="p-4 rounded-xl bg-accent-indigo/5 border border-accent-indigo/10 text-xs text-accent-indigo animate-pulse">
              {progress}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Video Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Lesson 1: Present Perfect Tense"
              className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-white/5 focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-white placeholder-white/20 outline-none transition-all"
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Video File
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-white/5 focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-white outline-none transition-all file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white/5 file:text-white hover:file:bg-white/10"
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Processing...' : 'Upload Video'}
          </button>
        </form>
      </main>
    </div>
  )
}
