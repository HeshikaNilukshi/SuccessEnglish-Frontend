import CourseCard from '@/components/CourseCard'

interface CourseGridProps {
  courses: Course[]
  loading: boolean
  error: string | null
  onRetry?: () => void
  enrolledCourseIds?: number[]
}

export default function CourseGrid({ courses, loading, error, onRetry, enrolledCourseIds }: CourseGridProps) {
  return (
    <section id="courses" className="py-24 max-w-7xl mx-auto px-6 md:px-12 relative z-10 scroll-mt-24">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary">
          Explore Our <span className="gradient-text-accent">Premium Courses</span>
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-accent-indigo to-accent-violet mx-auto rounded-full" />
        <p className="text-text-secondary text-sm md:text-base max-w-lg mx-auto">
          Start your transformation. Dive into specialized lessons designed by senior educators to advance your career.
        </p>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl bg-bg-secondary/60 border border-border-subtle p-7 h-[250px] flex flex-col justify-between"
            >
              <div className="absolute inset-0 shimmer-overlay animate-shimmer" />

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-black/5 animate-pulse" />
                <div className="h-6 w-3/4 rounded bg-black/5 animate-pulse" />
                <div className="h-4 w-full rounded bg-black/5 animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-black/5 animate-pulse" />
              </div>

              <div className="pt-4 border-t border-border-subtle flex justify-between items-center">
                <div className="h-3 w-1/3 rounded bg-black/5 animate-pulse" />
                <div className="h-3 w-1/4 rounded bg-black/5 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (error || courses.length === 0) && (
        <div className="max-w-md mx-auto text-center p-12 rounded-2xl glass-panel border-border-subtle shadow-xl space-y-6">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-black/5 border border-border-subtle">
            <span className="text-4xl animate-pulse">✨</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-indigo/10 to-accent-violet/10 rounded-2xl blur-md" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-text-primary tracking-tight">Courses Coming Soon</h3>
            <p className="text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
              Our academic advisors are crafting top-tier courses as we speak. Check back shortly to embark on your new learning journey.
            </p>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 px-6 py-2.5 rounded-full text-xs font-semibold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 hover:border-border-subtle transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M21 3v5h-5" />
              </svg>
              Refresh Status
            </button>
          )}
        </div>
      )}

      {!loading && !error && courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <CourseCard
              key={course.id}
              course={course}
              index={idx}
              isEnrolled={enrolledCourseIds?.includes(course.id) ?? false}
            />
          ))}
        </div>
      )}
    </section>
  )
}
