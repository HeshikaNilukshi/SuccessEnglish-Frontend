import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatDate } from '@/lib/utils'

const courseIcons = ['📚', '✍️', '📖', '📝', '🎓', '🧠', '🌐']

interface TeacherCourseCardProps {
  course: Course
  index: number
}

export default function TeacherCourseCard({ course, index }: TeacherCourseCardProps) {
  const icon = courseIcons[index % courseIcons.length]

  return (
    <Link
      to={`/teacher/${course.id}`}
      className="group block"
    >
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-2xl bg-bg-secondary border border-border-subtle p-6 transition-all duration-300 hover:-translate-x-1 hover:shadow-md">
        <div className="flex items-start sm:items-center gap-5 flex-grow">
          <div className="w-14 h-14 rounded-2xl border shrink-0 bg-black/5 border-border-subtle flex items-center justify-center text-2xl group-hover:bg-accent-indigo/10 group-hover:border-accent-indigo/30 transition-all duration-300">
            {icon}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-text-primary tracking-tight group-hover:text-accent-indigo transition-colors duration-200">
                {course.name}
              </h3>
              <Badge variant="outline" className="font-bold bg-accent-indigo/10 border-accent-indigo/20 text-accent-indigo py-0.5 px-2 rounded-lg text-[10px]">
                {formatPrice(course.price)}
              </Badge>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed max-w-xl font-medium line-clamp-2">
              {course.description || "No description provided."}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-black/5">
          <div className="flex flex-col items-start sm:items-end">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">
              Created
            </span>
            <span className="text-xs font-bold text-text-secondary">
              {formatDate(course.createdAt)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-black/5 group-hover:bg-accent-indigo/10 flex items-center justify-center text-text-primary group-hover:text-accent-indigo transition-all duration-200">
            <span className="text-lg font-bold group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
