import { useState, useEffect, useTransition } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchCourse, fetchMyResultsByCourse, type StudentAttemptResponse } from '@/actions/courses'
import { formatDate } from '@/lib/utils'
import PageShell from '@/components/teacher/PageShell'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { SearchInput } from '@/components/ui/SearchInput'
import { useDebounce } from '@/hooks/useDebounce'

export default function StudentCourseResults() {
  const { courseId } = useParams<{ courseId: string }>()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [course, setCourse] = useState<Course | null>(null)
  const [results, setResults] = useState<StudentAttemptResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

  const loadResults = (searchQuery: string) => {
    if (!courseId || !token) return
    if (!hasLoadedOnce) setLoading(true)
    setError(null)
    startTransition(async () => {
      try {
        const id = parseInt(courseId, 10)
        if (isNaN(id)) throw new Error('Invalid Course ID')
        const resultsData = await fetchMyResultsByCourse(token, id, searchQuery)
        setResults(resultsData)
        setHasLoadedOnce(true)
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load results.')
      } finally {
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    loadResults(debouncedSearchTerm)
  }, [courseId, token, debouncedSearchTerm])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-8 animate-pulse">
        <div className="h-4 w-32 bg-black/5 rounded mb-4" />
        <div className="h-10 w-80 bg-black/5 rounded mb-3" />
        <div className="h-4 w-60 bg-black/5 rounded mb-10" />
        <div className="h-40 bg-black/5 rounded-2xl border border-border-subtle" />
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="max-w-md mx-auto text-center p-12 mt-16 rounded-2xl glass-panel border-border-subtle shadow-xl space-y-6">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-900 font-medium text-3xl">
          ⚠️
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">{error || 'Results unavailable.'}</p>
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
    { label: 'My Results' }
  ]

  return (
    <PageShell
      title="My Results"
      subtitle={`Graded answersheets and scores for ${course.name}`}
      breadcrumbs={breadcrumbs}
    >
      <div className="flex-grow flex flex-col">
        <div className="flex w-full gap-4 mb-6">
          <div className="flex-grow">
            <SearchInput
              placeholder="Search results by ID or exam title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {results.length === 0 ? (
          debouncedSearchTerm ? (
            <EmptyState
              icon="🔍"
              title="No Matching Results"
              description={`No results found matching "${debouncedSearchTerm}".`}
            />
          ) : (
            <EmptyState
              icon="📊"
              title="No Exam Attempts Yet"
              description="You have not attempted any exams for this course yet."
            />
          )
        ) : (
          <div className={`glass-panel rounded-2xl border border-border-subtle overflow-hidden transition-opacity duration-200 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-subtle bg-black/5">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Exam Title</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Date Taken</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary text-right">Score / Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {results.map((attempt) => {
                  const rowClickable = attempt.isGraded
                  return (
                    <tr
                      key={attempt.id}
                      onClick={() => {
                        if (rowClickable) {
                          navigate(`/student/attempt/${attempt.id}`)
                        }
                      }}
                      className={`transition-colors duration-150 ${
                        rowClickable 
                          ? 'hover:bg-black/5 cursor-pointer' 
                          : 'cursor-default opacity-75'
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-text-primary">
                        {attempt.exam.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-muted">
                        {formatDate(attempt.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <Badge
                          variant={!attempt.isGraded ? "secondary" : "outline"}
                          className={`font-semibold bg-transparent ${
                            !attempt.isGraded
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900 font-medium'
                          }`}
                        >
                          {!attempt.isGraded ? 'Pending Grading' : `${attempt.score} Marks`}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageShell>
  )
}
