import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchCourse, fetchVideosByCourse } from '@/actions/courses'
import PageShell from '@/components/teacher/PageShell'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { AddVideoModal } from '@/components/ui/AddVideoModal'

export default function TeacherCourseVideos() {
  const { courseId } = useParams<{ courseId: string }>()
  const { token } = useAuth()

  const [course, setCourse] = useState<Course | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false)

  const loadContent = async () => {
    if (!courseId || !token) return
    try {
      setLoading(true)
      setError(null)
      const id = parseInt(courseId, 10)
      if (isNaN(id)) {
        throw new Error('Invalid Course ID')
      }

      const [courseData, videosData] = await Promise.all([
        fetchCourse(id, token),
        fetchVideosByCourse(token, id),
      ])

      setCourse(courseData)
      setVideos(videosData)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to load videos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContent()
  }, [courseId, token])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-8">
        <header className="mb-6">
          <div className="h-4 w-32 bg-black/5 rounded mb-4 animate-pulse" />
          <div className="h-10 w-80 bg-black/5 rounded mb-3 animate-pulse" />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-black/5 rounded-xl border border-border-subtle p-5 flex flex-col justify-between animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="max-w-md mx-auto text-center p-12 mt-16 rounded-2xl glass-panel border-border-subtle shadow-xl space-y-6">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-900 font-medium text-3xl">
          ⚠️
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-text-primary">Error</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{error || 'Course videos unavailable.'}</p>
        </div>
        <Link
          to={`/teacher/${courseId}`}
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
        >
          Back to Course
        </Link>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Home', href: '/teacher' },
    { label: course.name, href: `/teacher/${course.id}` },
    { label: 'Videos' }
  ]

  const headerActions = (
    <button
      type="button"
      onClick={() => setIsAddVideoOpen(true)}
      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:border-border-subtle active:scale-[0.98] transition-all cursor-pointer"
    >
      + Add Video
    </button>
  )

  return (
    <PageShell
      title={`${course.name} - Videos`}
      subtitle="Manage course video content and lectures."
      breadcrumbs={breadcrumbs}
      actions={headerActions}
    >
      <div className="flex-grow">
        {videos.length === 0 ? (
          <EmptyState
            icon="🎬"
            title="No Videos Uploaded"
            description="Add a lecture video to this course using the action button above."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
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
                    <Badge variant="outline" className="text-[10px] font-mono text-text-muted border-border-subtle px-1.5 py-0.5">
                      ID: #{video.id}
                    </Badge>
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

      <AddVideoModal
        isOpen={isAddVideoOpen}
        onClose={() => setIsAddVideoOpen(false)}
        courseId={course.id.toString()}
        token={token ?? ''}
        onSuccess={loadContent}
      />
    </PageShell>
  )
}
