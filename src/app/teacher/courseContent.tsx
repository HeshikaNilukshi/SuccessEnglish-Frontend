import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchCourse, fetchVideosByCourse, fetchExamsByCourse, fetchUploadSignature, saveVideoDetails } from '@/actions/courses'
import { createPortal } from 'react-dom'

export default function TeacherCourseContent() {
  const { courseId } = useParams<{ courseId: string }>()
  const { token } = useAuth()

  const [course, setCourse] = useState<Course | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'videos' | 'exams'>('videos')

  // Add Video states
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false)
  const [newVideoTitle, setNewVideoTitle] = useState('')
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null)
  const [isSavingVideo, setIsSavingVideo] = useState(false)
  const [addVideoProgress, setAddVideoProgress] = useState<string | null>(null)
  const [addVideoError, setAddVideoError] = useState<string | null>(null)

  useEffect(() => {
    const loadContent = async () => {
      if (!courseId || !token) return
      try {
        setLoading(true)
        setError(null)
        const id = parseInt(courseId, 10)
        if (isNaN(id)) {
          throw new Error('Invalid Course ID')
        }

        const [courseData, videosData, examsData] = await Promise.all([
          fetchCourse(id, token),
          fetchVideosByCourse(token, id),
          fetchExamsByCourse(token, id)
        ])

        setCourse(courseData)
        setVideos(videosData)
        setExams(examsData)
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load course content.')
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [courseId, token])

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

      // Update state
      setVideos((prev) => [newVideo, ...prev])
      setIsAddVideoOpen(false)
      // Reset form
      setNewVideoTitle('')
      setNewVideoFile(null)
    } catch (err: any) {
      console.error(err)
      setAddVideoError(err.message || 'An error occurred during upload.')
    } finally {
      setIsSavingVideo(false)
      setAddVideoProgress(null)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-8 animate-pulse">
        <div className="h-4 w-32 bg-black/5 rounded mb-4" />
        <div className="h-10 w-80 bg-black/5 rounded mb-3" />
        <div className="h-4 w-60 bg-black/5 rounded mb-10" />
        <div className="h-12 w-80 bg-black/5 rounded-xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-black/5 rounded-xl border border-border-subtle p-5 flex flex-col justify-between" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="max-w-md mx-auto text-center p-12 mt-16 rounded-2xl glass-panel border-border-subtle shadow-xl space-y-6">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-3xl">
          ⚠️
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-text-primary">Error</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{error || 'Course content unavailable.'}</p>
        </div>
        <Link
          to="/teacher"
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
        >
          Back to Panel
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-12">
      <header className="relative z-20 flex flex-col gap-4 mb-10 border-b border-border-subtle pb-6">
        <div>
          <Link
            to="/teacher"
            className="text-xs text-text-muted hover:text-text-primary transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer"
          >
            &larr; Back to Panel
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-primary mb-2">
                {course.name}
              </h1>
              <p className="text-text-secondary text-sm max-w-2xl leading-relaxed">
                {course.description || "Course details and curriculum management."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/teacher/${course.id}/students`}
                className="px-4 py-2 rounded-xl text-xs font-bold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all"
              >
                👥 View Students
              </Link>
              <Link
                to={`/teacher/${course.id}/results`}
                className="px-4 py-2 rounded-xl text-xs font-bold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all"
              >
                📊 Exam Results
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex justify-between items-center mb-8">
        <div className="bg-bg-secondary/80 border border-border-subtle rounded-xl p-1 flex gap-1.5 w-full max-w-[320px] shadow-card">
          <button
            type="button"
            onClick={() => setActiveTab('videos')}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeTab === 'videos'
                ? 'bg-gradient-to-r from-accent-indigo to-accent-violet text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                : 'text-text-secondary hover:text-text-primary hover:bg-black/5'
            }`}
          >
            🎥 Videos ({videos.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('exams')}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeTab === 'exams'
                ? 'bg-gradient-to-r from-accent-indigo to-accent-violet text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                : 'text-text-secondary hover:text-text-primary hover:bg-black/5'
            }`}
          >
            📝 Exams ({exams.length})
          </button>
        </div>

        <div>
          {activeTab === 'videos' ? (
            <button
              type="button"
              onClick={() => {
                setNewVideoTitle('')
                setNewVideoFile(null)
                setAddVideoError(null)
                setAddVideoProgress(null)
                setIsAddVideoOpen(true)
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:border-border-subtle active:scale-[0.98] transition-all cursor-pointer"
            >
              + Add Video
            </button>
          ) : (
            <Link
              to={`/teacher/${course.id}/exams/new`}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-accent-violet to-accent-pink hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all"
            >
              + Add Exam
            </Link>
          )}
        </div>
      </div>

      <main>
        {activeTab === 'videos' && (
          <div>
            {videos.length === 0 ? (
              <div className="text-center py-16 px-6 rounded-2xl glass-panel border-border-subtle max-w-xl mx-auto space-y-4">
                <span className="text-4xl block">🎬</span>
                <h3 className="text-lg font-bold text-text-primary">No Videos Uploaded</h3>
                <p className="text-xs text-text-secondary">
                  Add a lecture video to this course using the action buttons above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <Link
                    key={video.id}
                    to={`/teacher/${course.id}/videos/${video.id}`}
                    className="group relative flex flex-col justify-between rounded-2xl glass-panel glass-panel-hover p-6 min-h-[140px] text-left cursor-pointer"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-indigo to-accent-violet rounded-t-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-lg bg-black/5 border border-border-subtle flex items-center justify-center text-lg group-hover:bg-accent-indigo/10 group-hover:border-accent-indigo/30 transition-all duration-300">
                          🎥
                        </div>
                        <span className="text-[10px] font-mono text-text-muted">
                          ID: #{video.id}
                        </span>
                      </div>
                      
                      <h3 className="text-base font-bold text-text-primary tracking-tight group-hover:text-accent-indigo transition-colors duration-300 line-clamp-1">
                        {video.title}
                      </h3>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-muted">
                      <span>Uploaded {new Date(video.createdAt).toLocaleDateString()}</span>
                      <div
                        className="text-accent-indigo font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5"
                      >
                        Watch Video &rarr;
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'exams' && (
          <div>
            {exams.length === 0 ? (
              <div className="text-center py-16 px-6 rounded-2xl glass-panel border-border-subtle max-w-xl mx-auto space-y-4">
                <span className="text-4xl block">✍️</span>
                <h3 className="text-lg font-bold text-text-primary">No Exams Created</h3>
                <p className="text-xs text-text-secondary">
                  Create a course assessment using the Add Exam button above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam) => (
                  <Link
                    key={exam.id}
                    to={`/teacher/${course.id}/exams/${exam.id}`}
                    className="group relative flex flex-col justify-between rounded-2xl glass-panel glass-panel-hover p-6 min-h-[140px] text-left cursor-pointer"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-violet to-accent-pink rounded-t-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-lg bg-black/5 border border-border-subtle flex items-center justify-center text-lg group-hover:bg-accent-violet/10 group-hover:border-accent-violet/30 transition-all duration-300">
                          📝
                        </div>
                        <span className="text-[10px] font-mono text-text-muted">
                          {exam.duration > 0 ? `${exam.duration} mins` : 'Untimed'}
                        </span>
                      </div>
                      
                      <h3 className="text-base font-bold text-text-primary tracking-tight group-hover:text-accent-violet transition-colors duration-300 line-clamp-1">
                        {exam.title}
                      </h3>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-muted">
                      <span>Questions: {exam._count?.questions ?? 0}</span>
                      <div
                        className="text-accent-violet font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5"
                      >
                        View Exam &rarr;
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Video Modal */}
      {isAddVideoOpen && createPortal(
        <>
          <div
            className="fixed inset-0 bg-[#060813]/70 backdrop-blur-md z-50 transition-opacity duration-300 animate-fade-in"
            onClick={() => !isSavingVideo && setIsAddVideoOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="relative w-full max-w-lg rounded-3xl bg-bg-secondary/95 backdrop-blur-xl border border-border-subtle shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 md:p-8 animate-popover-in overflow-hidden">
              <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/25 to-transparent" />
              
              <button
                type="button"
                onClick={() => setIsAddVideoOpen(false)}
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
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-xs text-red-400">
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
                    onClick={() => setIsAddVideoOpen(false)}
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
      )}
    </div>
  )
}
