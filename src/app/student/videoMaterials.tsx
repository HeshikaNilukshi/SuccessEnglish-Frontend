import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchCourse, fetchVideoDetails } from '@/actions/courses'
import { fetchMaterialsByVideo } from '@/actions/materials'
import { formatDate } from '@/lib/utils'
import { DownloadCloud } from 'lucide-react'
import PageShell from '@/components/teacher/PageShell'
import { EmptyState } from '@/components/ui/EmptyState'

export default function StudentVideoMaterials() {
  const { courseId, videoId } = useParams<{ courseId: string; videoId: string }>()
  const { token } = useAuth()

  const [course, setCourse] = useState<Course | null>(null)
  const [video, setVideo] = useState<Video | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadContent = async () => {
      if (!courseId || !videoId || !token) return
      try {
        setLoading(true)
        setError(null)
        const cId = parseInt(courseId, 10)
        const vId = parseInt(videoId, 10)
        if (isNaN(cId) || isNaN(vId)) throw new Error('Invalid IDs')

        const [courseData, videoData, materialsData] = await Promise.all([
          fetchCourse(cId, token),
          fetchVideoDetails(token, vId),
          fetchMaterialsByVideo(token, vId),
        ])

        setCourse(courseData)
        setVideo(videoData)
        setMaterials(materialsData)
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load materials.')
      } finally {
        setLoading(false)
      }
    }
    loadContent()
  }, [courseId, videoId, token])

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

  if (error || !course || !video) {
    return (
      <div className="max-w-md mx-auto text-center p-12 mt-16 rounded-2xl glass-panel border-border-subtle shadow-xl space-y-6">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-900 font-medium text-3xl">
          ⚠️
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">{error || 'Materials unavailable.'}</p>
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
    { label: 'Lectures', href: `/student/${course.id}/videos` },
    { label: video.title, href: `/student/${course.id}/videos/${video.id}` },
    { label: 'Materials' }
  ]

  return (
    <PageShell
      title="Lecture Materials"
      subtitle={`Downloadable resources for ${video.title}`}
      breadcrumbs={breadcrumbs}
    >
      <div className="flex-grow flex flex-col">
        {materials.length === 0 ? (
          <EmptyState
            icon="📄"
            title="No Materials Yet"
            description="The teacher hasn't uploaded any materials for this lecture yet."
          />
        ) : (
          <div className="flex flex-col gap-4 animate-fade-in-up">
            {materials.map((material) => (
              <a
                key={material.id}
                href={material.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl glass-panel glass-panel-hover p-5 text-left cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-x-1"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent-indigo to-accent-violet rounded-l-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center gap-4 flex-grow">
                  <div className="w-12 h-12 rounded-xl bg-black/5 border border-border-subtle flex items-center justify-center text-xl shrink-0 group-hover:bg-accent-indigo/10 group-hover:border-accent-indigo/30 transition-all duration-300">
                    📄
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-text-primary tracking-tight group-hover:text-accent-indigo transition-colors duration-300">
                      {material.name}
                    </h3>
                    <p className="text-[11px] text-text-muted font-medium">
                      Uploaded {formatDate(material.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/[0.04]">
                  <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all active:scale-[0.98] group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:-translate-y-0.5">
                    <DownloadCloud className="w-4 h-4" />
                    Download
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}
