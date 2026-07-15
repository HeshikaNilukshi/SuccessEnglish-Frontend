import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchCourses, fetchStudentsByCourse, type CourseStudentResponse } from '@/actions/courses'
import { formatDate } from '@/lib/utils'
import PageShell from '@/components/teacher/PageShell'
import { EmptyState } from '@/components/ui/EmptyState'
import CourseCard from '@/components/ui/CourseCard'

export default function AdminCoursesList() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [coursesError, setCoursesError] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [students, setStudents] = useState<CourseStudentResponse[]>([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [studentsError, setStudentsError] = useState<string | null>(null)

  const loadCourses = async () => {
    setLoadingCourses(true)
    setCoursesError(null)
    try {
      const data = await fetchCourses()
      setCourses(data)
    } catch (err: any) {
      console.error(err)
      setCoursesError(err.message || 'Failed to load courses.')
    } finally {
      setLoadingCourses(false)
    }
  }

  const handleSelectCourse = async (course: Course) => {
    setSelectedCourse(course)
    setLoadingStudents(true)
    setStudentsError(null)
    if (!token) return
    try {
      const data = await fetchStudentsByCourse(token, course.id)
      setStudents(data)
    } catch (err: any) {
      console.error(err)
      setStudentsError(err.message || 'Failed to load students for this course.')
    } finally {
      setLoadingStudents(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const pageTitle = selectedCourse ? (
    <>
      {selectedCourse.name} <span className="gradient-text-accent">Enrolled Students</span>
    </>
  ) : (
    <>
      System <span className="gradient-text-accent">Courses</span>
    </>
  )

  const breadcrumbs = [
    { label: 'Home', href: '/admin' },
    ...(selectedCourse
      ? [
          { label: 'Courses', href: '/admin/courses' },
          { label: 'Enrolled Students' }
        ]
      : [
          { label: 'Courses' }
        ]
    )
  ]

  return (
    <PageShell
      title={pageTitle}
      subtitle={
        selectedCourse
          ? `Viewing all students enrolled in the course: ${selectedCourse.name}`
          : 'View all courses registered in the platform.'
      }
      breadcrumbs={breadcrumbs}
    >
      <div className="flex-grow flex flex-col animate-fade-in-up">
        {selectedCourse && (
          <button
            onClick={() => setSelectedCourse(null)}
            className="self-start text-xs text-text-muted hover:text-text-primary transition-colors duration-200 inline-flex items-center gap-1.5 mb-6 group cursor-pointer bg-transparent border-none outline-none"
          >
            &larr; Back to Courses List
          </button>
        )}

        {!selectedCourse ? (
          /* Courses List View */
          <div className="flex-grow flex flex-col">
            {loadingCourses && (
              <div className="flex justify-center items-center py-20 flex-grow">
                <div className="w-8 h-8 rounded-full border-2 border-accent-indigo border-t-transparent animate-spin" />
              </div>
            )}

            {!loadingCourses && coursesError && (
              <div className="max-w-md mx-auto text-center p-8 rounded-2xl bg-red-500/12 border border-red-500/25 shadow-xl space-y-4 my-auto">
                <p className="text-sm text-red-900 font-medium">{coursesError}</p>
                <button
                  type="button"
                  onClick={loadCourses}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loadingCourses && !coursesError && courses.length === 0 && (
              <EmptyState
                icon="📚"
                title="No Courses Found"
                description="There are currently no courses registered in the platform."
              />
            )}

            {!loadingCourses && !coursesError && courses.length > 0 && (
              <div className="flex flex-col gap-5 w-full">
                {courses.map((course, idx) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    index={idx}
                    onClick={() => handleSelectCourse(course)}
                    teacher={course.creator}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Enrolled Students Detail View */
          <div className="flex-grow flex flex-col">
            {loadingStudents && (
              <div className="flex justify-center items-center py-20 flex-grow">
                <div className="w-8 h-8 rounded-full border-2 border-accent-indigo border-t-transparent animate-spin" />
              </div>
            )}

            {!loadingStudents && studentsError && (
              <div className="max-w-md mx-auto text-center p-8 rounded-2xl bg-red-500/12 border border-red-500/25 shadow-xl space-y-4 my-auto">
                <p className="text-sm text-red-900 font-medium">{studentsError}</p>
                <button
                  type="button"
                  onClick={() => handleSelectCourse(selectedCourse)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loadingStudents && !studentsError && students.length === 0 && (
              <EmptyState
                icon="🎓"
                title="No Enrolled Students"
                description="No students are currently enrolled in this course."
              />
            )}

            {!loadingStudents && !studentsError && students.length > 0 && (
              <div className="relative overflow-hidden rounded-2xl border border-border-subtle glass-panel shadow-xl">
                <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/25 to-transparent" />
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border-subtle bg-black/5">
                        <th className="p-5 text-xs font-bold uppercase tracking-wider text-text-secondary">Student ID</th>
                        <th className="p-5 text-xs font-bold uppercase tracking-wider text-text-secondary">Name</th>
                        <th className="p-5 text-xs font-bold uppercase tracking-wider text-text-secondary">Email</th>
                        <th className="p-5 text-xs font-bold uppercase tracking-wider text-text-secondary">Enrollment Date</th>
                        <th className="p-5 text-xs font-bold uppercase tracking-wider text-text-secondary text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {students.map(item => (
                        <tr
                          key={item.id}
                          onClick={() => navigate(`/admin/user/${item.user.id}`)}
                          className="hover:bg-black/5 transition-colors duration-150 cursor-pointer"
                        >
                          <td className="p-5 text-sm font-semibold text-text-primary font-mono">{item.user.id}</td>
                          <td className="p-5 text-sm font-bold text-text-primary">{item.user.name}</td>
                          <td className="p-5 text-sm text-text-secondary">{item.user.email}</td>
                          <td className="p-5 text-sm text-text-muted">{formatDate(item.createdAt)}</td>
                          <td className="p-5 text-sm text-right">
                            <span className={`inline-block text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${
                              item.verified 
                                ? 'bg-emerald-500/10 text-emerald-900 font-medium border border-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {item.verified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageShell>
  )
}
