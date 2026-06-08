import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchCourse, fetchVideosByCourse, fetchExamsByCourse } from '@/actions/courses'

export default function StudentCourseContent() {
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

        // Fetch course details, videos, and exams in parallel
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
        setError(err.message || 'Failed to load course content. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [courseId, token])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-8 animate-pulse">
        {/* Back Link skeleton */}
        <div className="h-4 w-32 bg-white/5 rounded mb-4" />
        {/* Title skeleton */}
        <div className="h-10 w-80 bg-white/5 rounded mb-3" />
        {/* Description skeleton */}
        <div className="h-4 w-60 bg-white/5 rounded mb-10" />

        {/* Tab Buttons skeleton */}
        <div className="h-12 w-80 bg-white/5 rounded-xl mb-8" />

        {/* List Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-white/5 rounded-xl border border-white/[0.04] p-5 flex flex-col justify-between">
              <div className="h-4 w-2/3 bg-white/5 rounded" />
              <div className="h-3 w-1/3 bg-white/5 rounded" />
            </div>
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
          <h3 className="text-xl font-bold text-white">Access Denied or Error</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            {error || 'The course content you are looking for is unavailable.'}
          </p>
        </div>
        <Link
          to="/student"
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
        >
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-12">
      <header className="relative z-20 flex flex-col gap-4 mb-10 border-b border-white/[0.04] pb-6 animate-fade-in-up">
        <div>
          <Link
            to="/student"
            className="text-xs text-text-muted hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform duration-200">&larr;</span> Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
            {course.name}
          </h1>
          <p className="text-text-secondary text-sm max-w-2xl leading-relaxed">
            {course.description || "Learn comprehensive English grammar, conversational speaking skills, and unlock academic excellence."}
          </p>
        </div>
      </header>

      {/* Modern Pill Tabs */}
      <div className="flex justify-start mb-8 animate-fade-in-up animate-delay-100">
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

      {/* Tab Contents */}
      <main className="animate-fade-in-up animate-delay-200">
        {activeTab === 'videos' && (
          <div>
            {videos.length === 0 ? (
              <div className="text-center py-16 px-6 rounded-2xl glass-panel border-white/[0.04] max-w-xl mx-auto space-y-4">
                <span className="text-4xl block">🎬</span>
                <h3 className="text-lg font-bold text-white">No Lecture Videos Yet</h3>
                <p className="text-xs text-text-secondary">
                  Check back later! The teacher hasn't uploaded any videos for this course yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <article
                    key={video.id}
                    className="group relative flex flex-col justify-between rounded-2xl glass-panel glass-panel-hover p-6 min-h-[140px]"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-indigo to-accent-violet rounded-t-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg shadow-inner group-hover:bg-accent-indigo/10 group-hover:border-accent-indigo/30 transition-all duration-300">
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
                      <Link
                        to={`/student/${course.id}/videos/${video.id}`}
                        className="text-accent-indigo font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5"
                      >
                        Watch Video &rarr;
                      </Link>
                    </div>
                  </article>
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
                <h3 className="text-lg font-bold text-white">No Exams Scheduled Yet</h3>
                <p className="text-xs text-text-secondary">
                  Great news! There are no exams or assessments scheduled for this course at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam) => (
                  <article
                    key={exam.id}
                    className="group relative flex flex-col justify-between rounded-2xl glass-panel glass-panel-hover p-6 min-h-[140px]"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-violet to-accent-pink rounded-t-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg shadow-inner group-hover:bg-accent-violet/10 group-hover:border-accent-violet/30 transition-all duration-300">
                          📝
                        </div>
                        <span className="text-[10px] font-mono text-text-muted flex gap-2">
                          <span>{exam.duration > 0 ? `${exam.duration} mins` : 'Untimed'}</span>
                        </span>
                      </div>
                      
                      <h3 className="text-base font-bold text-white tracking-tight group-hover:text-accent-violet transition-colors duration-300 line-clamp-1">
                        {exam.title}
                      </h3>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-text-muted">
                      <span>Questions: {exam._count?.questions ?? 0}</span>
                      <Link
                        to={`/student/${course.id}/exams/${exam.id}`}
                        className="text-accent-violet font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5"
                      >
                        Start Exam &rarr;
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
