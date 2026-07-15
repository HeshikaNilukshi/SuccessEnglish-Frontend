import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatDate } from '@/lib/utils'

const courseIcons = ['📚', '✍️', '📖', '📝', '🎓', '🧠', '🌐']

interface CourseCardProps {
  course: any // Course object
  index: number
  to?: string
  onClick?: () => void
  teacher?: {
    id: number | string
    name: string
  }
}

export default function CourseCard({ course, index, to, onClick, teacher }: CourseCardProps) {
  const icon = courseIcons[index % courseIcons.length]

  const content = (
    <Card className="relative flex w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-blue-300 group-hover:shadow-xl group-hover:shadow-blue-200/50">
      {/* Left icon panel */}
      <div className="relative flex w-24 shrink-0 items-center justify-center bg-gradient-to-b from-blue-700 via-blue-600 to-blue-500">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl">
          {icon}
        </div>
      </div>

      {/* Body */}
      <div className="flex min-w-0 flex-grow flex-col">
        <div className="flex items-start justify-between gap-4 px-6 pt-5">
          <div className="min-w-0 space-y-1.5">
            <h3 className="truncate text-lg font-bold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-blue-700">
              {course.name}
            </h3>
            <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
              {course.description || 'No description provided.'}
            </p>
          </div>

          <Badge className="shrink-0 rounded-full bg-blue-600 px-3 py-1 text-sm font-bold text-white shadow-sm hover:bg-blue-600">
            {formatPrice(course.price)}
          </Badge>
        </div>

        <div className="mt-auto px-6 pb-4 pt-4">
          <Separator className="mb-3 bg-slate-100" />
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-400">
              <span className="cursor-default">
                #<span className="font-mono font-semibold text-slate-600">{course.id}</span>
              </span>

              {teacher && (
                <span className="cursor-default">
                  Teacher:{' '}
                  <span className="font-semibold text-slate-600">{teacher.name}</span>
                </span>
              )}

              <span>
                Created:{' '}
                <span className="font-semibold text-slate-600">
                  {formatDate(course.createdAt)}
                </span>
              </span>
            </div>

            <span className="text-sm font-semibold text-blue-600 transition-transform duration-200 group-hover:translate-x-1">
              &rarr;
            </span>
          </div>
        </div>
      </div>
    </Card>
  )

  if (to) {
    return (
      <Link to={to} className="group block">
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group block w-full cursor-pointer border-none bg-transparent p-0 text-left outline-none"
    >
      {content}
    </button>
  )
}
