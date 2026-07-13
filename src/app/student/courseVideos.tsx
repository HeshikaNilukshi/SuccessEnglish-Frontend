import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchCourse, fetchVideosByCourse } from '@/actions/courses'
import { formatDate } from '@/lib/utils'
import PageShell from '@/components/teacher/PageShell'
import { EmptyState } from '@/components/ui/EmptyState'

export default function StudentCourseVideos() {
  const { courseId } = useParams<{ courseId: string }>()
  const { token } = useAuth()

  const [course, setCourse] = useState<Course | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadVideos = async () => {
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

    loadVideos()
  }, [courseId, token])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-8 animate-pulse">
        <div className="h-4 w-32 bg-black/5 rounded mb-4" />
        <div className="h-10 w-80 bg-black/5 rounded mb-3" />
        <div className="h-4 w-60 bg-black/5 rounded mb-10" />
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-black/5 rounded-2xl border border-border-subtle p-5" />
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
        <p className="text-text-secondary text-sm leading-relaxed">{error || 'Videos unavailable.'}</p>
        <Link
          to={courseId ? `/student/${courseId}` : '/student'}
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
        >
          Back to Course Dashboard
        </Link>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Home', href: '/student' },
    { label: course.name, href: `/student/${course.id}` },
    { label: 'Lectures' }
  ]

  return (
    <PageShell
      title="Lectures"
      subtitle={`Course lecture videos for ${course.name}`}
      breadcrumbs={breadcrumbs}
    >
      <div className="flex-grow flex flex-col animate-fade-in-up">
        {videos.length === 0 ? (
          <EmptyState
            icon="🎬"
            title="No Lecture Videos Yet"
            description="Check back later! The teacher hasn't uploaded any videos for this course yet."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {videos.map((video) => (
              <Link
                key={video.id}
                to={`/student/${course.id}/videos/${video.id}`}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl glass-panel glass-panel-hover p-5 text-left cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-x-1"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent-indigo to-accent-violet rounded-l-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center gap-4 flex-grow">
                  <div className="w-12 h-12 rounded-xl bg-black/5 border border-border-subtle flex items-center justify-center text-xl shrink-0 group-hover:bg-accent-indigo/10 group-hover:border-accent-indigo/30 transition-all duration-300">
                    🎥
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-text-primary tracking-tight group-hover:text-accent-indigo transition-colors duration-300">
                      {video.title}
                    </h3>
                    <p className="text-[11px] text-text-muted font-medium">
                      Uploaded {formatDate(video.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/[0.04]">
                  <div className="text-xs font-bold text-accent-indigo opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex items-center gap-1">
                    Watch Video <span className="text-sm">&rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}
