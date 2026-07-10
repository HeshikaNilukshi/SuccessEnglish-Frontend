import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { formatDate } from '@/utils/format-datetime'
import { ResultsChart, type AreaData } from './results-chart'

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

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-12">
      <header className="relative z-20 flex flex-col gap-4 mb-10 border-b border-border-subtle pb-6 animate-fade-in-up">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-text-muted hover:text-text-primary transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer bg-transparent border-none outline-none"
          >
            &larr; Back
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-primary">
                Student <span className="gradient-text-accent">Progress</span>
              </h1>
              <p className="text-text-secondary text-sm md:text-base">
                Exam results of <span className="text-text-primary font-semibold">{data?.studentName || 'Student'}</span> (ID: {id}).
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="space-y-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {/* Loading state */}
        {loading && (
          <div className="relative overflow-hidden rounded-2xl bg-bg-secondary/60 border border-border-subtle p-7 h-[400px] flex flex-col justify-center items-center">
            <div className="absolute inset-0 shimmer-overlay animate-shimmer" />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-black/5 animate-pulse" />
              <div className="h-4 w-48 rounded bg-black/5 animate-pulse" />
            </div>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="max-w-md mx-auto text-center p-8 rounded-2xl bg-red-500/12 border border-red-500/25 shadow-xl space-y-4">
            <div className="text-3xl">⚠️</div>
            <p className="text-sm text-red-900 font-medium">{error}</p>
          </div>
        )}

        {/* No attempts state */}
        {!loading && !error && (!data || data.areaChartData.length === 0) && (
          <div className="max-w-xl mx-auto text-center py-16 px-8 rounded-2xl glass-panel border-border-subtle shadow-xl space-y-6 relative overflow-hidden group">
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/20 to-transparent" />
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-black/5 border border-border-subtle transition-transform duration-500 group-hover:scale-110">
              <span className="text-4xl">📈</span>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-text-primary tracking-tight">No Graded Attempts Yet</h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-md mx-auto">
                Once exams are completed and graded, the student's performance timeline will appear here.
              </p>
            </div>
          </div>
        )}

        {/* Chart & Table View */}
        {!loading && !error && data && data.areaChartData.length > 0 && (
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
                        <td className="px-6 py-4 text-sm text-right font-bold text-text-primary">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            item.score >= 75
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900 font-medium'
                              : item.score >= 50
                              ? 'bg-accent-indigo/10 border-accent-indigo/20 text-accent-indigo'
                              : 'bg-red-500/10 border-red-500/20 text-red-900'
                          }`}>
                            {item.score}%
                          </span>
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
  )
}
