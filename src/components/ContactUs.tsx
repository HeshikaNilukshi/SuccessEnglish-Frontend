export default function ContactUs() {
  return (
    <section id="contact" className="py-24 max-w-7xl mx-auto px-6 md:px-12 relative z-10 scroll-mt-24">
      {/* Background Decorative Glow */}
      <div className="absolute top-[40%] left-[-15%] w-[450px] h-[450px] bg-accent-violet/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
          Get in <span className="gradient-text-accent">Touch with Us</span>
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-accent-indigo to-accent-violet mx-auto rounded-full" />
        <p className="text-text-secondary text-sm md:text-base max-w-lg mx-auto">
          Have questions or want to register? Connect with us directly through our official channels. We are always ready to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left column: Direct Contact Channels */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-white mb-2">Academy Contacts</h3>
          
          {/* Phone Detail */}
          <div className="glass-panel p-5 rounded-xl border border-white/[0.04] flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-accent-indigo/10 border border-accent-indigo/20 flex items-center justify-center text-lg text-accent-indigo shrink-0">
              📞
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Phone / WhatsApp</h4>
              <p className="text-sm font-medium text-white mt-1">+94 77 123 4567</p>
              <p className="text-xs text-text-secondary mt-0.5">+94 11 987 6543 (Office)</p>
            </div>
          </div>

          {/* Email Detail */}
          <div className="glass-panel p-5 rounded-xl border border-white/[0.04] flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-lg text-accent-violet shrink-0">
              ✉️
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Email Address</h4>
              <p className="text-sm font-medium text-white mt-1">info@successenglish.lk</p>
              <p className="text-xs text-text-secondary mt-0.5">admissions@successenglish.lk</p>
            </div>
          </div>

          {/* Address Detail */}
          <div className="glass-panel p-5 rounded-xl border border-white/[0.04] flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-accent-pink/10 border border-accent-pink/20 flex items-center justify-center text-lg text-accent-pink shrink-0">
              📍
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Academy Campus</h4>
              <p className="text-sm font-medium text-white mt-1">Success English Academy</p>
              <p className="text-xs text-text-secondary mt-0.5">Galle Road, Colombo 03, Sri Lanka</p>
            </div>
          </div>

          {/* Working Hours */}
          <div className="glass-panel p-5 rounded-xl border border-white/[0.04] flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-lg text-emerald-400 shrink-0">
              ⏰
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Office Hours</h4>
              <p className="text-sm font-medium text-white mt-1">Monday - Sunday</p>
              <p className="text-xs text-text-secondary mt-0.5">8:00 AM - 6:00 PM (IST)</p>
            </div>
          </div>
        </div>

        {/* Right column: Interactive Social/Connect Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* WhatsApp Card */}
          <a
            href="https://wa.me/94771234567"
            target="_blank"
            rel="noopener noreferrer"
            className="group glass-panel p-8 rounded-2xl border border-white/[0.04] hover:border-[#25D366]/30 hover:bg-[#0b0f1e]/85 transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,211,102,0.06)] flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center mb-6 text-white group-hover:bg-[#25D366]/20 transition-all duration-300">
                <svg className="w-6 h-6 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97-1.863-1.87-4.334-2.9-6.969-2.9-5.442 0-9.87 4.372-9.874 9.802-.001 1.768.479 3.49 1.39 5.012l-.993 3.628 3.702-.958zm10.995-7.525c-.273-.136-1.62-.801-1.871-.892-.252-.093-.435-.136-.619.137-.184.272-.712.892-.873 1.076-.16.183-.32.203-.593.067-.273-.136-1.153-.424-2.196-1.355-.812-.724-1.36-1.619-1.519-1.892-.16-.273-.017-.42.119-.556.124-.122.274-.32.411-.479.136-.16.184-.272.273-.453.093-.183.047-.34-.023-.477-.07-.136-.619-1.493-.848-2.043-.223-.538-.469-.465-.62-.473-.16-.008-.344-.01-.528-.01-.184 0-.482.069-.734.34-.252.273-.963.942-.963 2.298 0 1.356.985 2.665 1.123 2.852.138.187 1.94 2.96 4.699 4.152.656.284 1.168.453 1.567.579.66.21 1.261.181 1.737.11.53-.08 1.62-.663 1.85-1.302.228-.638.228-1.186.16-1.302-.07-.11-.252-.2-.526-.336z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#25D366] transition-colors duration-300">WhatsApp Support</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Connect with our academic counselors directly for admissions, course structures, and registration assistance.
              </p>
            </div>
            <div className="text-xs font-semibold text-[#25D366] mt-6 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
              Chat Now ➔
            </div>
          </a>

          {/* Facebook Card */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group glass-panel p-8 rounded-2xl border border-white/[0.04] hover:border-[#1877F2]/30 hover:bg-[#0b0f1e]/85 transition-all duration-300 hover:shadow-[0_0_30px_rgba(24,119,242,0.06)] flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/20 flex items-center justify-center mb-6 text-white group-hover:bg-[#1877F2]/20 transition-all duration-300">
                <svg className="w-6 h-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#1877F2] transition-colors duration-300">Facebook Community</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Join our private group of 10k+ learners. Get access to free webinars, learning tips, and community events.
              </p>
            </div>
            <div className="text-xs font-semibold text-[#1877F2] mt-6 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
              Join Group ➔
            </div>
          </a>

          {/* Instagram Card */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group glass-panel p-8 rounded-2xl border border-white/[0.04] hover:border-[#E1306C]/30 hover:bg-[#0b0f1e]/85 transition-all duration-300 hover:shadow-[0_0_30px_rgba(225,48,108,0.06)] flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#E1306C]/10 border border-[#E1306C]/20 flex items-center justify-center mb-6 text-white group-hover:bg-[#E1306C]/20 transition-all duration-300">
                <svg className="w-6 h-6 text-[#E1306C]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0-3.584.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#E1306C] transition-colors duration-300">Instagram Feed</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Follow our official page for vocabulary tips, grammar quizzes, event schedules, and student achievement showcases.
              </p>
            </div>
            <div className="text-xs font-semibold text-[#E1306C] mt-6 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
              Follow Us ➔
            </div>
          </a>

          {/* YouTube Card */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group glass-panel p-8 rounded-2xl border border-white/[0.04] hover:border-[#FF0000]/30 hover:bg-[#0b0f1e]/85 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,0,0,0.06)] flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FF0000]/10 border border-[#FF0000]/20 flex items-center justify-center mb-6 text-white group-hover:bg-[#FF0000]/20 transition-all duration-300">
                <svg className="w-6 h-6 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FF0000] transition-colors duration-300">YouTube Channel</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Watch high-quality, free video lessons, speaking advice, real-world conversations, and vocabulary tutorials from our expert faculty.
              </p>
            </div>
            <div className="text-xs font-semibold text-[#FF0000] mt-6 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
              Subscribe ➔
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
