import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchStudentsByCourse, type CourseStudentResponse } from '@/actions/courses'
import PageShell from '@/components/teacher/PageShell'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/EmptyState'

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
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 flex flex-col items-stretch">
        <div className="h-4 w-32 bg-slate-100 rounded mb-4 animate-pulse" />
        <div className="h-10 w-80 bg-slate-100 rounded mb-10 animate-pulse" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-[#fbfbfa] border border-[#e2e8f0] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center p-12 mt-16 rounded-2xl bg-[#fbfbfa] border border-[#e2e8f0] shadow-sm space-y-6">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 font-medium text-3xl">
          ⚠️
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[#0f172a]">Error</h3>
          <p className="text-[#64748b] text-sm leading-relaxed">{error}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/teacher/${courseId}`)}
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-text-primary bg-[#f8fafc] border border-[#e2e8f0] hover:bg-slate-50 transition-all cursor-pointer"
        >
          Back to Course
        </button>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Home', href: '/teacher' },
    { label: 'Course', href: `/teacher/${courseId}` },
    { label: 'Enrolled Students' }
  ]

  return (
    <PageShell
      title="Enrolled Students"
      subtitle="A list of all students currently enrolled in this course."
      breadcrumbs={breadcrumbs}
    >
      <div className="w-full max-w-7xl mx-auto flex-grow flex flex-col">
        {students.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No Students Enrolled"
            description="No students have requested or been verified for enrollment in this course yet."
          />
        ) : (
          <div className="bg-[#fbfbfa] rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#64748b]">Student Name</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#64748b]">Email Address</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#64748b] text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {students.map((student) => (
                  <tr
                    key={student.id}
                    onClick={() => navigate(`/teacher/student/${student.user.id}/profile`)}
                    className="hover:bg-slate-50 transition-colors duration-150 cursor-pointer text-[#0f172a]"
                  >
                    <td className="px-6 py-4 text-sm font-semibold">
                      {student.user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#64748b] font-medium">{student.user.email}</td>
                    <td className="px-6 py-4 text-right">
                      <Badge
                        variant={student.verified ? "outline" : "secondary"}
                        className={`font-bold py-1 px-2.5 rounded-lg text-xs border ${
                          student.verified
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                            : 'bg-amber-50 border-amber-100 text-amber-700'
                        }`}
                      >
                        {student.verified ? 'Verified' : 'Pending'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageShell>
  )
}
