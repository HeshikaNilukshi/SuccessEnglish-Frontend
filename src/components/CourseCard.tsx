import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const courseIcons = ['📚', '✍️', '📖', '📝', '🎓', '🧠', '🌐']

export default function CourseCard({ course, index, isEnrolled }: { course: Course, index: number, isEnrolled?: boolean }) {
  const { user } = useAuth()
  const icon = courseIcons[index % courseIcons.length]

  let linkTarget = isEnrolled ? "/student" : `/student/enrollment/${course.id}`
  let label = isEnrolled ? "Go to Dashboard" : "Explore Details"

  if (user) {
    if (user.role === 'TEACHER') {
      linkTarget = '/teacher'
      label = "Go to Dashboard"
    } else if (user.role === 'ADMIN') {
      linkTarget = '/admin'
      label = "Go to Dashboard"
    }
  }

  return (
    <Link
      to={linkTarget}
      className="group relative flex flex-col justify-between rounded-2xl glass-panel glass-panel-hover p-7 text-left cursor-pointer"
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-pink rounded-t-2xl opacity-80 group-hover:opacity-100 transition-opacity" />

      <div className="space-y-4">

        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner group-hover:bg-accent-indigo/10 group-hover:border-accent-indigo/30 transition-all duration-300">
          {icon}
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-accent-indigo transition-colors duration-300">
          {course.name}
        </h3>

        <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
          {course.description || "Learn comprehensive English grammar, conversational speaking skills, and unlock academic excellence."}
        </p>
      </div>

      <div className="mt-8 pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs">
        <div
          className="text-accent-indigo font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1"
        >
          {label} <span className="text-sm">&rarr;</span>
        </div>
      </div>
    </Link>
  )
}
