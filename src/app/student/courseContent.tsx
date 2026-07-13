import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchCourse, fetchCourseStats, type CourseStats } from '@/actions/courses'
import { formatDate, formatPrice } from '@/lib/utils'
import PageShell from '@/components/teacher/PageShell'
import { Video, FileText, BarChart3 } from 'lucide-react'

export default function StudentCourseContent() {
  const { courseId } = useParams<{ courseId: string }>()
  const { token } = useAuth()

  const [course, setCourse] = useState<Course | null>(null)
  const [stats, setStats] = useState<CourseStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

        const [courseData, statsData] = await Promise.all([
          fetchCourse(id, token),
          fetchCourseStats(token, id)
        ])

        setCourse(courseData)
        setStats(statsData)
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
        <div className="h-4 w-32 bg-black/5 rounded mb-4" />
        {/* Title skeleton */}
        <div className="h-10 w-80 bg-black/5 rounded mb-3" />
        {/* Description skeleton */}
        <div className="h-4 w-60 bg-black/5 rounded mb-10" />

        {/* List Row skeleton */}
        <div className="flex flex-col gap-5 w-full">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-black/5 rounded-2xl border border-border-subtle p-6" />
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
          <h3 className="text-xl font-bold text-text-primary">Access Denied or Error</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            {error || 'The course content you are looking for is unavailable.'}
          </p>
        </div>
        <Link
          to="/student"
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
        >
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Home', href: '/student' },
    { label: course.name }
  ]

  const cards = [
    {
      title: 'Lectures',
      description: 'Access course video lectures, lessons, and learning material.',
      count: stats?.videoCount ?? 0,
      link: `/student/${course.id}/videos`,
      icon: Video,
      color: 'from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30',
      iconColor: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
      accentColor: 'bg-gradient-to-r from-blue-500 to-indigo-500'
    },
    {
      title: 'Exams',
      description: 'Take course assessments, timed exams, and view questionnaires.',
      count: stats?.examCount ?? 0,
      link: `/student/${course.id}/exams`,
      icon: FileText,
      color: 'from-violet-500/20 to-pink-500/20 hover:from-violet-500/30 hover:to-pink-500/30',
      iconColor: 'text-violet-600 bg-violet-500/10 border-violet-500/20',
      accentColor: 'bg-gradient-to-r from-violet-500 to-pink-500'
    },
    {
      title: 'My Results',
      description: 'View attempt history, detailed answersheets, scores, and teacher feedback.',
      count: stats?.resultsCount ?? 0,
      link: `/student/${course.id}/results`,
      icon: BarChart3,
      color: 'from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30',
      iconColor: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
      accentColor: 'bg-gradient-to-r from-amber-500 to-orange-500'
    }
  ]

  return (
    <PageShell
      title={course.name}
      subtitle={course.description || "Learn comprehensive English grammar, conversational speaking skills, and unlock academic excellence."}
      infoText={
        <div className="flex items-center gap-2 flex-wrap">
          <span>Price: {formatPrice(course.price)}</span>
          <span className="opacity-60">•</span>
          <span>Created: {formatDate(course.createdAt)}</span>
        </div>
      }
      breadcrumbs={breadcrumbs}
    >
      <div className="flex flex-col gap-5 w-full animate-fade-in-up">
        {cards.map((card, idx) => {
          const Icon = card.icon
          return (
            <Link
              key={idx}
              to={card.link}
              className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-2xl bg-gradient-to-r ${card.color} border border-border-subtle p-6 transition-all duration-300 hover:-translate-x-1 hover:shadow-md`}
            >
              <div className="flex items-start sm:items-center gap-5 flex-grow">
                <div className={`w-14 h-14 rounded-2xl border shrink-0 flex items-center justify-center ${card.iconColor} transition-all duration-300 group-hover:scale-105`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-text-primary tracking-tight group-hover:text-accent-indigo transition-colors duration-200">
                    {card.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed max-w-xl font-medium">
                    {card.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-black/5">
                <div className="flex flex-col items-start sm:items-end">
                  <span className="text-3xl font-extrabold text-text-primary tracking-tight">
                    {card.count}
                  </span>
                  <span className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">
                    {card.title === 'My Results' ? 'Attempts' : card.title}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-black/5 group-hover:bg-accent-indigo/10 flex items-center justify-center text-text-primary group-hover:text-accent-indigo transition-all duration-200">
                  <span className="text-lg font-bold group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </PageShell>
  )
}
