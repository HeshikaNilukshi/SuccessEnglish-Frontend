import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchStudentsByCourse, type CourseStudentResponse } from '@/actions/courses'

export default function CourseStudents() {
  const navigate = useNavigate()
  const { courseId } = useParams<{ courseId: string }>()
  const { token } = useAuth()

  const [students, setStudents] = useState<CourseStudentResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadStudents = async () => {
      if (!courseId || !token) return
      try {
        setLoading(true)
        setError(null)
        const id = parseInt(courseId, 10)
        if (isNaN(id)) {
          throw new Error('Invalid Course ID')
        }

        const data = await fetchStudentsByCourse(token, id)
        setStudents(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load students.')
      } finally {
        setLoading(false)
      }
    }

    loadStudents()
  }, [courseId, token])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-8 animate-pulse">
        <div className="h-4 w-32 bg-black/5 rounded mb-4" />
        <div className="h-10 w-80 bg-black/5 rounded mb-10" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-black/5 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center p-12 mt-16 rounded-2xl glass-panel border-border-subtle shadow-xl space-y-6">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-900 font-medium text-3xl">
          ⚠️
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-text-primary">Error</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{error}</p>
        </div>
        <Link
          to={`/teacher/${courseId}`}
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
        >
          Back to Course
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 pt-16 pb-16">
      <header className="mb-10 border-b border-border-subtle pb-6">
        <Link
          to={`/teacher/${courseId}`}
          className="text-xs text-text-muted hover:text-text-primary transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer"
        >
          &larr; Back to Course
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary mb-2">
          Enrolled Students
        </h1>
        <p className="text-text-secondary text-sm">
          A list of all students currently enrolled in this course.
        </p>
      </header>

      <main>
        {students.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-2xl glass-panel border-border-subtle max-w-xl mx-auto space-y-4">
            <span className="text-4xl block">👥</span>
            <h3 className="text-lg font-bold text-text-primary">No Students Enrolled</h3>
            <p className="text-xs text-text-secondary">
              No students have requested or been verified for enrollment in this course yet.
            </p>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl border border-border-subtle overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-subtle bg-black/5">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Student Name</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Email Address</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {students.map((student) => (
                  <tr
                    key={student.id}
                    onClick={() => navigate(`/teacher/student/${student.user.id}/profile`)}
                    className="hover:bg-black/5 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-text-primary">
                      {student.user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{student.user.email}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        student.verified
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900 font-medium'
                          : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      }`}>
                        {student.verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
