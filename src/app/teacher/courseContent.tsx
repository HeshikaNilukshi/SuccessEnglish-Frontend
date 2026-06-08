import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchCourse, fetchVideosByCourse, fetchExamsByCourse } from '@/actions/courses'

export default function TeacherCourseContent() {
  const { courseId } = useParams<{ courseId: string }>()
  const { token } = useAuth()

  const [course, setCourse] = useState<Course | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'videos' | 'exams'>('videos')

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-8 animate-pulse">
        <div className="h-4 w-32 bg-white/5 rounded mb-4" />
        <div className="h-10 w-80 bg-white/5 rounded mb-3" />
        <div className="h-4 w-60 bg-white/5 rounded mb-10" />
        <div className="h-12 w-80 bg-white/5 rounded-xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-white/5 rounded-xl border border-white/[0.04] p-5 flex flex-col justify-between" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="max-w-md mx-auto text-center p-12 mt-16 rounded-2xl glass-panel border-white/[0.04] shadow-xl space-y-6">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-3xl">
          ⚠️
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Error</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{error || 'Course content unavailable.'}</p>
        </div>
        <Link
          to="/teacher"
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
        >
          Back to Panel
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-12">
      <header className="relative z-20 flex flex-col gap-4 mb-10 border-b border-white/[0.04] pb-6">
        <div>
          <Link
            to="/teacher"
            className="text-xs text-text-muted hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer"
          >
            &larr; Back to Panel
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
                {course.name}
              </h1>
              <p className="text-text-secondary text-sm max-w-2xl leading-relaxed">
                {course.description || "Course details and curriculum management."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/teacher/${course.id}/students`}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                👥 View Students
              </Link>
              <Link
                to={`/teacher/${course.id}/results`}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                📊 Exam Results
              </Link>
              <Link
                to={`/teacher/${course.id}/videos/new`}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all"
              >
                + Add Video
              </Link>
              <Link
                to={`/teacher/${course.id}/exams/new`}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-accent-violet to-accent-pink hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all"
              >
                + Add Exam
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex justify-start mb-8">
        <div className="bg-bg-secondary/80 border border-white/[0.04] rounded-xl p-1 flex gap-1.5 w-full max-w-[320px] shadow-card">
          <button
            type="button"
            onClick={() => setActiveTab('videos')}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeTab === 'videos'
                ? 'bg-gradient-to-r from-accent-indigo to-accent-violet text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                : 'text-text-secondary hover:text-white hover:bg-white/[0.02]'
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
                : 'text-text-secondary hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            📝 Exams ({exams.length})
          </button>
        </div>
      </div>

      <main>
        {activeTab === 'videos' && (
          <div>
            {videos.length === 0 ? (
              <div className="text-center py-16 px-6 rounded-2xl glass-panel border-white/[0.04] max-w-xl mx-auto space-y-4">
                <span className="text-4xl block">🎬</span>
                <h3 className="text-lg font-bold text-white">No Videos Uploaded</h3>
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
                        <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg group-hover:bg-accent-indigo/10 group-hover:border-accent-indigo/30 transition-all duration-300">
                          🎥
                        </div>
                        <span className="text-[10px] font-mono text-text-muted">
                          ID: #{video.id}
                        </span>
                      </div>
                      
                      <h3 className="text-base font-bold text-white tracking-tight group-hover:text-accent-indigo transition-colors duration-300 line-clamp-1">
                        {video.title}
                      </h3>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-text-muted">
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
              <div className="text-center py-16 px-6 rounded-2xl glass-panel border-white/[0.04] max-w-xl mx-auto space-y-4">
                <span className="text-4xl block">✍️</span>
                <h3 className="text-lg font-bold text-white">No Exams Created</h3>
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
                        <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg group-hover:bg-accent-violet/10 group-hover:border-accent-violet/30 transition-all duration-300">
                          📝
                        </div>
                        <span className="text-[10px] font-mono text-text-muted">
                          {exam.duration > 0 ? `${exam.duration} mins` : 'Untimed'}
                        </span>
                      </div>
                      
                      <h3 className="text-base font-bold text-white tracking-tight group-hover:text-accent-violet transition-colors duration-300 line-clamp-1">
                        {exam.title}
                      </h3>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-text-muted">
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
    </div>
  )
}
