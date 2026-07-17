import { useState, useEffect, useTransition } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchCourse, fetchVideosByCourse } from '@/actions/courses'
import PageShell from '@/components/teacher/PageShell'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { AddVideoModal } from '@/components/ui/AddVideoModal'
import { formatDate } from '@/lib/utils'
import { SearchInput } from '@/components/ui/SearchInput'
import { useDebounce } from '@/hooks/useDebounce'

export default function TeacherCourseVideos() {
  const { courseId } = useParams<{ courseId: string }>()
  const { token } = useAuth()
  const location = useLocation()
  const basePath = location.pathname.startsWith('/admin') ? '/admin/courses' : '/teacher'

  const [course, setCourse] = useState<Course | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId || !token) return
      try {
        const id = parseInt(courseId, 10)
        if (isNaN(id)) throw new Error('Invalid Course ID')
        const courseData = await fetchCourse(id, token)
        setCourse(courseData)
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load course details.')
      }
    }
    loadCourse()
  }, [courseId, token])

  const loadVideos = (searchQuery: string) => {
    if (!courseId || !token) return
    if (!hasLoadedOnce) setLoading(true)
    setError(null)
    startTransition(async () => {
      try {
        const id = parseInt(courseId, 10)
        if (isNaN(id)) throw new Error('Invalid Course ID')
        const videosData = await fetchVideosByCourse(token, id, searchQuery)
        setVideos(videosData)
        setHasLoadedOnce(true)
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load videos.')
      } finally {
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    loadVideos(debouncedSearchTerm)
  }, [courseId, token, debouncedSearchTerm])

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
    { label: 'Videos' }
  ]

  return (
    <PageShell
      title={`${course.name} - Videos`}
      subtitle="Manage course video content and lectures."
      breadcrumbs={breadcrumbs}
    >
      <div className="flex-grow flex flex-col">
        <div className="flex w-full gap-4 mb-6">
          <div className="flex-grow">
            <SearchInput
              placeholder="Search videos by ID or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => setIsAddVideoOpen(true)}
            className="relative inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold text-white overflow-hidden rounded-xl transition-all duration-300 active:scale-[0.98] hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] cursor-pointer group/btn whitespace-nowrap shrink-0"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-accent-indigo to-accent-violet" />
            <span className="relative flex items-center gap-1.5">
              + Add Video
            </span>
          </button>
        </div>

        {videos.length === 0 ? (
          debouncedSearchTerm ? (
            <EmptyState
              icon="🔍"
              title="No Matching Videos"
              description={`No videos found matching "${debouncedSearchTerm}".`}
            />
          ) : (
            <EmptyState
              icon="🎬"
              title="No Videos Uploaded"
              description="Add a lecture video to this course using the action button above."
            />
          )
        ) : (
          <div className={`flex flex-col gap-4 animate-fade-in-up transition-opacity duration-200 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
            {videos.map((video) => (
              <Link
                key={video.id}
                to={`${basePath}/${course.id}/videos/${video.id}`}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl glass-panel glass-panel-hover p-5 text-left cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-x-1"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent-indigo to-accent-violet rounded-l-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center gap-4 flex-grow">
                  <div className="w-12 h-12 rounded-xl bg-black/5 border border-border-subtle flex items-center justify-center text-xl shrink-0 group-hover:bg-accent-indigo/10 group-hover:border-accent-indigo/30 transition-all duration-300">
                    🎥
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-base font-bold text-text-primary tracking-tight group-hover:text-accent-indigo transition-colors duration-300">
                        {video.title}
                      </h3>
                      <Badge variant="outline" className="text-[9px] font-mono text-text-muted border-border-subtle px-1.5 py-0.5 rounded-md">
                        ID: #{video.id}
                      </Badge>
                    </div>
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

      <AddVideoModal
        isOpen={isAddVideoOpen}
        onClose={() => setIsAddVideoOpen(false)}
        courseId={course.id.toString()}
        token={token ?? ''}
        onSuccess={() => loadVideos(debouncedSearchTerm)}
      />
    </PageShell>
  )
}
