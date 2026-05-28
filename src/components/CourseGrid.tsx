import type { Course } from '../actions/courses'
import CourseCard from './CourseCard'

interface CourseGridProps {
  courses: Course[]
  loading: boolean
  error: string | null
  onRetry?: () => void
}

export default function CourseGrid({ courses, loading, error, onRetry }: CourseGridProps) {
  return (
    <section id="courses" className="py-24 max-w-7xl mx-auto px-6 md:px-12 relative z-10 scroll-mt-24">
      {/* Grid Header */}
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
          Explore Our <span className="gradient-text-accent">Premium Courses</span>
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-accent-indigo to-accent-violet mx-auto rounded-full" />
        <p className="text-text-secondary text-sm md:text-base max-w-lg mx-auto">
          Start your transformation. Dive into specialized lessons designed by senior educators to advance your career.
        </p>
      </div>

      {/* Loading state: Skeleton grid */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl bg-bg-secondary/60 border border-white/[0.04] p-7 h-[250px] flex flex-col justify-between"
            >
              {/* Shimmer loading mask */}
              <div className="absolute inset-0 shimmer-overlay animate-shimmer" />

              <div className="space-y-4">
                {/* Icon bubble skeleton */}
                <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse" />
                {/* Title skeleton */}
                <div className="h-6 w-3/4 rounded bg-white/5 animate-pulse" />
                {/* Description line 1 skeleton */}
                <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
                {/* Description line 2 skeleton */}
                <div className="h-4 w-5/6 rounded bg-white/5 animate-pulse" />
              </div>

              {/* Footer skeleton */}
              <div className="pt-4 border-t border-white/[0.04] flex justify-between items-center">
                <div className="h-3 w-1/3 rounded bg-white/5 animate-pulse" />
                <div className="h-3 w-1/4 rounded bg-white/5 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state: Visual dialogue component */}
      {!loading && error && (
        <div className="max-w-md mx-auto text-center p-8 rounded-2xl glass-panel border-accent-indigo/20 shadow-xl space-y-6 animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-accent-indigo/10 border border-accent-indigo/20 flex items-center justify-center text-3xl mx-auto">
            ⚠️
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Oops, Fetching Failed</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              We couldn't connect to our course repository API. Please make sure the backend server is running and try again.
            </p>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {/* Empty State: Welcoming view */}
      {!loading && !error && courses.length === 0 && (
        <div className="max-w-md mx-auto text-center p-12 rounded-2xl glass-panel space-y-6 animate-fade-in-up">
          <div className="text-5xl">🌱</div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Coming Soon!</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Our academic advisors are crafting top-tier courses as we speak. Check back shortly to embark on your new learning journey.
            </p>
          </div>
        </div>
      )}

      {/* Active Grid Listings */}
      {!loading && !error && courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <CourseCard key={course.id} course={course} index={idx} />
          ))}
        </div>
      )}
    </section>
  )
}
