export default function Hero() {
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id)
    if (el) {
      e.preventDefault()
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-45 md:pb-28">
      <div className="absolute inset-0 radial-glow-main pointer-events-none -z-10" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 border border-border-subtle text-xs font-semibold tracking-wide text-text-primary mb-8 hover:bg-black/5 hover:border-accent-indigo/30 transition-all duration-300">
          <span className="flex h-2 w-2 relative">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-indigo"></span>
          </span>
          Sri Lanka's Premium English Academy
        </div>

        <h1 className="animate-fade-in-up [animation-delay:150ms] text-4xl md:text-7xl font-bold tracking-tight text-text-primary leading-[1.1] max-w-4xl">
          Master English <br className="hidden md:inline" />
          <span className="text-accent-indigo">With Absolute Confidence</span>
        </h1>

        <p className="mt-6 text-base md:text-xl text-text-secondary leading-relaxed max-w-2xl">
          Elevate your vocabulary, writing skills, and pronunciation through our modern student-first learning academy. Accelerate your career and personal growth.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <a 
            href="#courses" 
            onClick={(e) => handleAnchorClick(e, 'courses')}
            className="px-8 py-4 rounded-full text-base font-semibold text-white bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_30px_rgba(99,102,241,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto"
          >
            Explore Courses
          </a>
          <a 
            href="#about" 
            onClick={(e) => handleAnchorClick(e, 'about')}
            className="px-8 py-4 rounded-full text-base font-semibold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 hover:border-border-subtle hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto"
          >
            Learn More
          </a>
        </div>

        <div className="mt-20 w-full max-w-5xl border-t border-border-subtle pt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-text-primary">99%</div>
            <div className="text-xs md:text-sm text-text-muted mt-1 font-medium tracking-wide uppercase">Success Rate</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-text-primary">10K+</div>
            <div className="text-xs md:text-sm text-text-muted mt-1 font-medium tracking-wide uppercase">Happy Alumni</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-text-primary">25+</div>
            <div className="text-xs md:text-sm text-text-muted mt-1 font-medium tracking-wide uppercase">Elite Curriculums</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-text-primary">100%</div>
            <div className="text-xs md:text-sm text-text-muted mt-1 font-medium tracking-wide uppercase">Online Materials</div>
          </div>
        </div>
      </div>
    </section>
  )
}
