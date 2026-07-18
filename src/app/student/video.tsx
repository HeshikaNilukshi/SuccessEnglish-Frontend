import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchVideoDetails } from '@/actions/courses'
import PageShell from '@/components/teacher/PageShell'
import { formatDate } from '@/lib/utils'

export default function StudentVideoPage() {
  const { courseId, videoId } = useParams<{ courseId: string; videoId: string }>()
  const { token } = useAuth()

  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        setError(err.message || 'Failed to load video. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadVideo()
  }, [videoId, token])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-10 pb-8 animate-pulse flex flex-col items-stretch">
        {/* Back Link skeleton */}
        <div className="h-4 w-32 bg-black/5 rounded mb-4" />
        {/* Title skeleton */}
        <div className="h-10 w-96 bg-black/5 rounded mb-8" />
        {/* Video Player Box skeleton */}
        <div className="w-full aspect-video bg-black/5 rounded-2xl border border-border-subtle shadow-2xl" />
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
            {error || 'The video you are trying to view is unavailable or access is restricted.'}
          </p>
        </div>
        <Link
          to={`/student/${courseId}`}
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
        >
          Back to Course Content
        </Link>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Home', href: '/student' },
    { label: 'Course', href: `/student/${courseId}` },
    { label: video.title }
  ]

  return (
    <PageShell
      title={video.title}
      subtitle={`Uploaded ${formatDate(video.createdAt)}`}
      breadcrumbs={breadcrumbs}
      maxWidthClass="max-w-5xl"
    >
      <main className="relative w-full flex flex-col items-center animate-fade-in-up gap-8">
        {/* Colorful glow effect sitting behind player */}
        <div className="absolute inset-0 bg-gradient-to-tr from-accent-indigo/10 via-accent-violet/5 to-accent-pink/5 rounded-2xl blur-3xl opacity-50 -z-10" />

        <div className="w-full aspect-video rounded-2xl overflow-hidden glass-panel border border-border-subtle shadow-2xl relative bg-black/60">
          <iframe
            src={video.videoUrl}
            title={video.title}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        <div className="w-full glass-panel rounded-2xl border border-border-subtle p-6 md:p-8 text-left space-y-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-3">Description</h3>
            {video.description ? (
              <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
                {video.description}
              </p>
            ) : (
              <p className="text-text-muted text-sm italic">No Description</p>
            )}
          </div>
          
          <div className="pt-6 border-t border-white/[0.04]">
            <Link
              to={`/student/${courseId}/videos/${videoId}/materials`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all active:scale-[0.98]"
            >
              📄 View Lecture Materials
            </Link>
          </div>
        </div>
      </main>
    </PageShell>
  )
}
