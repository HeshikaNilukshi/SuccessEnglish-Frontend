import { Link } from 'react-router-dom'
import { formatDate } from '@/lib/utils'

const courseIcons = ['📚', '✍️', '📖', '📝', '🎓', '🧠', '🌐']

interface DashboardCourseCardProps {
  enrollment: Enrollment
  index: number
}

export default function DashboardCourseCard({ enrollment, index }: DashboardCourseCardProps) {
  const icon = courseIcons[index % courseIcons.length]
  const isVerified = enrollment.verified

  if (isVerified) {
    return (
      <Link
        to={`/student/${enrollment.course.id}`}
        className="group relative flex flex-col md:flex-row md:items-center justify-between rounded-2xl glass-panel glass-panel-hover p-8 md:p-10 text-left cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 min-h-[180px] gap-6"
      >
        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-accent-indigo via-accent-violet to-accent-pink rounded-l-2xl opacity-80 group-hover:opacity-100 transition-opacity" />

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-grow">
          <div className="w-16 h-16 rounded-2xl bg-black/5 border border-border-subtle flex items-center justify-center text-3xl shadow-inner shrink-0 group-hover:bg-accent-indigo/10 group-hover:border-accent-indigo/30 transition-all duration-300">
            {icon}
          </div>

          <div className="space-y-2 flex-grow">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight group-hover:text-accent-indigo transition-colors duration-300">
                {enrollment.course.name}
              </h3>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold tracking-wide border bg-emerald-500/10 border-emerald-500/20 text-emerald-900">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Active ✓
              </div>
            </div>

            <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-3xl">
              {enrollment.course.description || "Learn comprehensive English grammar, conversational speaking skills, and unlock academic excellence."}
            </p>
            
            <div className="text-[11px] md:text-xs text-text-muted">
              Joined {formatDate(enrollment.createdAt)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/[0.04]">
          <div className="text-xs md:text-sm font-bold text-accent-indigo opacity-80 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all flex items-center gap-1">
            Access Course <span className="text-sm md:text-base">&rarr;</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <article
      className="group relative flex flex-col md:flex-row md:items-center justify-between rounded-2xl glass-panel p-8 md:p-10 text-left min-h-[180px] gap-6"
    >
      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-accent-indigo via-accent-violet to-accent-pink rounded-l-2xl opacity-60" />

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-grow">
        <div className="w-16 h-16 rounded-2xl bg-black/5 border border-border-subtle flex items-center justify-center text-3xl shadow-inner shrink-0">
          {icon}
        </div>

        <div className="space-y-2 flex-grow">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">
              {enrollment.course.name}
            </h3>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold tracking-wide border bg-amber-500/10 border-amber-500/20 text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Pending Verification ⏳
            </div>
          </div>

          <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-3xl">
            {enrollment.course.description || "Learn comprehensive English grammar, conversational speaking skills, and unlock academic excellence."}
          </p>
          
          <div className="text-[11px] md:text-xs text-text-muted">
            Joined {formatDate(enrollment.createdAt)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/[0.04]">
        <span className="text-xs md:text-sm text-text-muted italic">Awaiting Approval</span>
      </div>
    </article>
  )
}
