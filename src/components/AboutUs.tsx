export default function AboutUs() {
  return (
    <section id="about" className="py-24 max-w-7xl mx-auto px-6 md:px-12 relative z-10 scroll-mt-24">
      <div className="absolute top-[20%] right-[-10%] w-[350px] h-[350px] bg-accent-indigo/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] left-[-10%] w-[300px] h-[300px] bg-accent-pink/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-indigo/10 border border-accent-indigo/20 text-xs font-semibold tracking-wide text-accent-indigo">
            About Our Academy
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary leading-tight">
            Elevating English <br />
            <span className="gradient-text-accent">For Your Global Future</span>
          </h2>
          <p className="text-text-secondary text-base md:text-lg leading-relaxed">
            At Success English Academy, we bridge the gap between traditional learning and global communication standards. Our methodology goes beyond standard learning to build genuine fluency and absolute confidence.
          </p>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">
            Whether you are preparing for international entrance exams, aiming for career advancement in multinational corporate settings, or looking to refine your daily conversational command, we provide the curated environments and resources to get you there.
          </p>
          
          <div className="pt-4 flex items-center gap-6">
            <div>
              <div className="text-2xl font-bold text-text-primary">10+</div>
              <div className="text-xs text-text-muted mt-0.5 font-medium">Years Experience</div>
            </div>
            <div className="w-px h-10 bg-black/5" />
            <div>
              <div className="text-2xl font-bold text-text-primary">5,000+</div>
              <div className="text-xs text-text-muted mt-0.5 font-medium">Certified Graduates</div>
            </div>
            <div className="w-px h-10 bg-black/5" />
            <div>
              <div className="text-2xl font-bold text-text-primary">99%</div>
              <div className="text-xs text-text-muted mt-0.5 font-medium font-sans">Passing Rate</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="glass-panel glass-panel-hover p-8 rounded-2xl border border-border-subtle flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent-indigo/10 border border-accent-indigo/20 flex items-center justify-center text-xl mb-6">
                🎓
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Expert Instructors</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Learn from certified ESL educators, international test examiners, and academic coaches dedicated to your success.
              </p>
            </div>
          </div>

          <div className="glass-panel glass-panel-hover p-8 rounded-2xl border border-border-subtle flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-xl mb-6">
                📚
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Elite Curriculums</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Study from custom-designed learning modules built for real-world fluency, public speaking, and professional correspondence.
              </p>
            </div>
          </div>

          <div className="glass-panel glass-panel-hover p-8 rounded-2xl border border-border-subtle flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent-pink/10 border border-accent-pink/20 flex items-center justify-center text-xl mb-6">
                ⚡
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Interactive Approach</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Experience dynamic classroom settings, real-time feedback, digital library access, and group speaking sessions.
              </p>
            </div>
          </div>

          <div className="glass-panel glass-panel-hover p-8 rounded-2xl border border-border-subtle flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl mb-6">
                🌐
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Global Network</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Join our active alumni database spanning across major global corporations, overseas universities, and tech hubs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
