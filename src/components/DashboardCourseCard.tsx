import { Link } from 'react-router-dom'

const courseIcons = ['📚', '✍️', '📖', '📝', '🎓', '🧠', '🌐']

interface DashboardCourseCardProps {
  enrollment: Enrollment
  index: number
}

export default function DashboardCourseCard({ enrollment, index }: DashboardCourseCardProps) {
  const icon = courseIcons[index % courseIcons.length]
  const isVerified = enrollment.verified

  return (
    <article
      className="group relative flex flex-col justify-between rounded-2xl glass-panel glass-panel-hover p-7"
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-pink rounded-t-2xl opacity-80 group-hover:opacity-100 transition-opacity" />

      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner group-hover:bg-accent-indigo/10 group-hover:border-accent-indigo/30 transition-all duration-300">
            {icon}
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${
              isVerified
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isVerified ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
            {isVerified ? 'Active ✓' : 'Pending Verification ⏳'}
          </div>
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-accent-indigo transition-colors duration-300">
          {enrollment.course.name}
        </h3>

        <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
          {enrollment.course.description || "Learn comprehensive English grammar, conversational speaking skills, and unlock academic excellence."}
        </p>
      </div>

      <div className="mt-8 pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs text-text-muted">
        <span>Joined {new Date(enrollment.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        {isVerified ? (
          <Link
            to={`/student/${enrollment.course.id}`}
            className="text-accent-indigo font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1 cursor-pointer"
          >
            Access Course <span className="text-sm">&rarr;</span>
          </Link>
        ) : (
          <span className="text-text-muted italic">Awaiting Approval</span>
        )}
      </div>
    </article>
  )
}
