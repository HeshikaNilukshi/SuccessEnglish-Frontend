import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchVideoDetails } from '@/actions/courses'

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
        <div className="h-4 w-32 bg-white/5 rounded mb-4" />
        {/* Title skeleton */}
        <div className="h-10 w-96 bg-white/5 rounded mb-8" />
        {/* Video Player Box skeleton */}
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
            {error || 'The video you are trying to view is unavailable or access is restricted.'}
          </p>
        </div>
        <Link
          to={`/student/${courseId}`}
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
        >
          Back to Course Content
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 pt-10 pb-16 flex flex-col">
      <header className="relative z-20 flex flex-col gap-2 mb-8 animate-fade-in-up">
        <div>
          <Link
            to={`/student/${courseId}`}
            className="text-xs text-text-muted hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform duration-200">&larr;</span> Back to course content
          </Link>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
            {video.title}
          </h1>
        </div>
      </header>

      {/* Centered Iframe Player Container */}
      <main className="relative w-full flex justify-center items-center animate-fade-in-up animate-delay-100">
        {/* Colorful glow effect sitting behind player */}
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
    </div>
  )
}
