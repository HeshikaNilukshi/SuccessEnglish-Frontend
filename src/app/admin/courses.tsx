import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchCourses, fetchStudentsByCourse, type CourseStudentResponse } from '@/actions/courses'
import { formatDate, formatPrice } from '@/lib/utils'

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

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-12">
      <header className="relative z-20 flex flex-col gap-4 mb-10 border-b border-border-subtle pb-6 animate-fade-in-up">
        <div>
          {selectedCourse ? (
            <button
              onClick={() => setSelectedCourse(null)}
              className="text-xs text-text-muted hover:text-text-primary transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer bg-transparent border-none outline-none"
            >
              &larr; Back to Courses List
            </button>
          ) : (
            <Link
              to="/admin"
              className="text-xs text-text-muted hover:text-text-primary transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer"
            >
              &larr; Back to Dashboard
            </Link>
          )}

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-primary">
            {selectedCourse ? selectedCourse.name : 'System'}{' '}
            <span className="gradient-text-accent">
              {selectedCourse ? 'Enrolled Students' : 'Courses'}
            </span>
          </h1>
          <p className="text-text-secondary text-sm md:text-base">
            {selectedCourse
              ? `Viewing all students enrolled in the course: ${selectedCourse.name}`
              : 'View all courses registered in the platform.'}
          </p>
        </div>
      </header>

      <main className="animate-fade-in-up animate-delay-100">
        {!selectedCourse ? (
          /* Courses List View */
          <div>
            {loadingCourses && (
              <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 rounded-full border-2 border-accent-indigo border-t-transparent animate-spin" />
              </div>
            )}

            {!loadingCourses && coursesError && (
              <div className="max-w-md mx-auto text-center p-8 rounded-2xl bg-red-500/12 border border-red-500/25 shadow-xl space-y-4">
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
              <p className="text-center py-12 text-sm text-text-secondary">No courses found.</p>
            )}

            {!loadingCourses && !coursesError && courses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                  <button
                    key={course.id}
                    onClick={() => handleSelectCourse(course)}
                    className="text-left group relative flex flex-col justify-between rounded-2xl glass-panel p-6 hover:-translate-y-1 hover:border-border-subtle active:scale-[0.98] transition-all duration-300 shadow-xl cursor-pointer"
                  >
                    <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/20 to-transparent" />
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-mono text-text-muted">COURSE ID: {course.id}</span>
                        <h2 className="text-lg font-bold tracking-tight text-text-primary group-hover:text-accent-indigo transition-colors duration-200 mt-1">
                          {course.name}
                        </h2>
                        <p className="text-xs text-text-secondary leading-relaxed mt-2 line-clamp-3">
                          {course.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-border-subtle flex items-center justify-between text-xs font-semibold">
                      <span className="text-text-primary">{formatPrice(course.price)}</span>
                      <span className="text-accent-indigo group-hover:text-text-primary transition-colors duration-200">
                        View Enrolled Students &rarr;
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Enrolled Students Detail View */
          <div>
            {loadingStudents && (
              <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 rounded-full border-2 border-accent-indigo border-t-transparent animate-spin" />
              </div>
            )}

            {!loadingStudents && studentsError && (
              <div className="max-w-md mx-auto text-center p-8 rounded-2xl bg-red-500/12 border border-red-500/25 shadow-xl space-y-4">
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
              <p className="text-center py-12 text-sm text-text-secondary">No students enrolled in this course.</p>
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
      </main>
    </div>
  )
}
