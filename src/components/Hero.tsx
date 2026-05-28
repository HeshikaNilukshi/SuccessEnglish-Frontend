export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-36 md:pb-28">
      {/* Background patterns */}
      <div className="absolute inset-0 radial-glow-main pointer-events-none -z-10" />

      {/* Floating Animated Gradient Orbs inside Section */}
      <div className="absolute top-1/4 left-[-10%] w-[350px] h-[350px] rounded-full bg-accent-indigo/10 blur-[80px] animate-float" />
      <div className="absolute bottom-10 right-[-5%] w-[300px] h-[300px] rounded-full bg-accent-violet/8 blur-[80px] animate-float [animation-delay:3s]" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
        {/* Animated Badge */}
        <div className="animate-fade-in-up flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wide text-text-primary mb-8 hover:bg-white/10 hover:border-accent-indigo/30 transition-all duration-300">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-indigo opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-indigo"></span>
          </span>
          Sri Lanka's Premium English Academy
        </div>

        {/* Hero Title */}
        <h1 className="animate-fade-in-up [animation-delay:150ms] text-4xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] max-w-4xl">
          Master English <br className="hidden md:inline" />
          <span className="gradient-text-accent">With Absolute Confidence</span>
        </h1>

        {/* Hero Description */}
        <p className="animate-fade-in-up [animation-delay:300ms] mt-6 text-base md:text-xl text-text-secondary leading-relaxed max-w-2xl">
          Elevate your vocabulary, writing skills, and pronunciation through our modern student-first learning academy. Accelerate your career and personal growth.
        </p>

        {/* Hero Actions */}
        <div className="animate-fade-in-up [animation-delay:450ms] mt-10 flex flex-col sm:flex-row items-center gap-4">
          <a 
            href="#courses" 
            className="px-8 py-4 rounded-full text-base font-semibold text-white bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_30px_rgba(99,102,241,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto"
          >
            Explore Courses
          </a>
          <a 
            href="#about" 
            className="px-8 py-4 rounded-full text-base font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto"
          >
            Learn More
          </a>
        </div>

        {/* Achievements / Stats bar */}
        <div className="animate-fade-in-up [animation-delay:600ms] mt-20 w-full max-w-5xl border-t border-white/[0.04] pt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-white">99%</div>
            <div className="text-xs md:text-sm text-text-muted mt-1 font-medium tracking-wide uppercase">Success Rate</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-white">10K+</div>
            <div className="text-xs md:text-sm text-text-muted mt-1 font-medium tracking-wide uppercase">Happy Alumni</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-white">25+</div>
            <div className="text-xs md:text-sm text-text-muted mt-1 font-medium tracking-wide uppercase">Elite Curriculums</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-white">100%</div>
            <div className="text-xs md:text-sm text-text-muted mt-1 font-medium tracking-wide uppercase">Online Materials</div>
          </div>
        </div>
      </div>
    </section>
  )
}
