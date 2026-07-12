import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { formatDate } from '@/utils/format-datetime'
import { ResultsChart, type AreaData } from '../../components/results-chart'
import PageShell from '@/components/teacher/PageShell'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/EmptyState'

export default function StudentResultsDashboard() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [data, setData] = useState<{ studentName: string; areaChartData: AreaData[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !id) return
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`http://localhost:5000/api/student/${id}/results`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch results data')
        }
        const result = await response.json()
        setData(result)
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load progress data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, token])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-12 flex flex-col items-stretch">
        <div className="h-4 w-32 bg-black/5 rounded mb-4 animate-pulse" />
        <div className="h-10 w-96 bg-black/5 rounded mb-8 animate-pulse" />
        <div className="w-full aspect-video bg-black/5 rounded-2xl border border-border-subtle shadow-2xl animate-pulse" />
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
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
        >
          Go Back
        </button>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Panel', href: '/teacher' },
    { label: 'Student Progress' }
  ]

  const subtitle = `Exam results of ${data?.studentName || 'Student'} (ID: ${id}).`

  return (
    <PageShell
      title="Student Progress"
      subtitle={subtitle}
      breadcrumbs={breadcrumbs}
    >
      <div className="w-full max-w-7xl mx-auto">
        <main className="space-y-8">
          {(!data || data.areaChartData.length === 0) ? (
            <EmptyState
              icon="📈"
              title="No Graded Attempts Yet"
              description="Once exams are completed and graded, the student's performance timeline will appear here."
            />
          ) : (
            <div className="space-y-10">
              <ResultsChart data={data.areaChartData} />

              <div className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
                  Detailed Exam Results
                </h2>
                <div className="glass-panel rounded-2xl border border-border-subtle overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border-subtle bg-black/5">
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Exam Title</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Course Name</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Date Taken</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {data.areaChartData.map((item, index) => (
                        <tr
                          key={item.attemptId || index}
                          onClick={() => navigate(`/teacher/attempt/${item.attemptId}`)}
                          className="hover:bg-black/5 transition-colors duration-150 cursor-pointer"
                        >
                          <td className="px-6 py-4 text-sm font-semibold text-text-primary">
                            {item.examTitle}
                          </td>
                          <td className="px-6 py-4 text-sm text-text-secondary">
                            {item.courseName}
                          </td>
                          <td className="px-6 py-4 text-sm text-text-secondary">
                            {formatDate(item.date)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Badge
                              variant={item.score >= 75 ? "outline" : item.score >= 50 ? "secondary" : "destructive"}
                              className={`font-semibold ${
                                item.score >= 75
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900 font-medium'
                                  : item.score >= 50
                                  ? 'bg-accent-indigo/10 border-accent-indigo/20 text-accent-indigo'
                                  : 'bg-red-500/10 border-red-500/20 text-red-900'
                              }`}
                            >
                              {item.score}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </PageShell>
  )
}
