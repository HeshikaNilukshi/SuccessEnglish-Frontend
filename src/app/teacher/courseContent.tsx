import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchCourse, fetchVideosByCourse, fetchExamsByCourse, fetchStudentsByCourse } from '@/actions/courses'
import PageShell from '@/components/teacher/PageShell'
import { CreateCourseModal } from '@/components/ui/CreateCourseModal'
import { DeleteCourseModal } from '@/components/ui/DeleteCourseModal'
import { MoreVertical, Video, FileText, Users, Pencil, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

export default function TeacherCourseContent() {
  const { courseId } = useParams<{ courseId: string }>()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [course, setCourse] = useState<Course | null>(null)
  const [videoCount, setVideoCount] = useState(0)
  const [examCount, setExamCount] = useState(0)
  const [studentCount, setStudentCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const loadDashboardData = async () => {
    if (!courseId || !token) return
    try {
      setLoading(true)
      setError(null)
      const id = parseInt(courseId, 10)
      if (isNaN(id)) {
        throw new Error('Invalid Course ID')
      }

      const [courseData, videosData, examsData, studentsData] = await Promise.all([
        fetchCourse(id, token),
        fetchVideosByCourse(token, id),
        fetchExamsByCourse(token, id),
        fetchStudentsByCourse(token, id)
      ])

      setCourse(courseData)
      setVideoCount(videosData.length)
      setExamCount(examsData.length)
      setStudentCount(studentsData.length)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to load course dashboard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [courseId, token])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-8">
        <header className="mb-6">
          <div className="h-4 w-32 bg-black/5 rounded mb-4 animate-pulse" />
          <div className="h-10 w-80 bg-black/5 rounded mb-3 animate-pulse" />
        </header>
        <div className="flex flex-col gap-5 mt-10 w-full">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-black/5 rounded-2xl border border-border-subtle p-6 animate-pulse" />
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
          <p className="text-text-secondary text-sm leading-relaxed">{error || 'Course details unavailable.'}</p>
        </div>
        <Link
          to="/teacher"
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Home', href: '/teacher' },
    { label: course.name }
  ]

  const headerActions = (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 rounded-xl bg-white/10 border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer focus:outline-none flex items-center justify-center">
          <MoreVertical className="w-5 h-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-bg-secondary border border-border-subtle rounded-2xl shadow-xl p-1.5 animate-popover-in">
          <DropdownMenuItem
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl text-text-primary hover:bg-black/5 transition-all cursor-pointer outline-none"
          >
            <Pencil className="w-4 h-4" /> Edit Course
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl text-red-600 hover:bg-red-500/10 transition-all cursor-pointer outline-none"
          >
            <Trash2 className="w-4 h-4" /> Delete Course
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  const cards = [
    {
      title: 'Videos',
      description: 'Upload and manage course video lectures, lessons, and video content.',
      count: videoCount,
      link: `/teacher/${course.id}/videos`,
      icon: Video,
      color: 'from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30',
      iconColor: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
      accentColor: 'bg-gradient-to-r from-blue-500 to-indigo-500'
    },
    {
      title: 'Exams',
      description: 'Create assessments, compile question banks, and publish timed exams.',
      count: examCount,
      link: `/teacher/${course.id}/exams`,
      icon: FileText,
      color: 'from-violet-500/20 to-pink-500/20 hover:from-violet-500/30 hover:to-pink-500/30',
      iconColor: 'text-violet-600 bg-violet-500/10 border-violet-500/20',
      accentColor: 'bg-gradient-to-r from-violet-500 to-pink-500'
    },
    {
      title: 'Students',
      description: 'View student enrollments, exam answers, and grade exam attempts.',
      count: studentCount,
      link: `/teacher/${course.id}/students`,
      icon: Users,
      color: 'from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30',
      iconColor: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
      accentColor: 'bg-gradient-to-r from-emerald-500 to-teal-500'
    }
  ]

  return (
    <PageShell
      title={course.name}
      subtitle={course.description || "Course details and curriculum management."}
      breadcrumbs={breadcrumbs}
      actions={headerActions}
    >
      <div className="flex flex-col gap-5 mt-4 w-full">
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
                    {card.title}
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

      <CreateCourseModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        token={token ?? ''}
        onSuccess={loadDashboardData}
        course={course}
      />

      <DeleteCourseModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        token={token ?? ''}
        courseId={course.id}
        courseName={course.name}
        onSuccess={() => navigate('/teacher')}
      />
    </PageShell>
  )
}
