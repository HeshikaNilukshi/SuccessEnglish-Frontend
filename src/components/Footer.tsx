import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    const hash = to.split('#')[1]
    if (!hash) return
    const el = document.getElementById(hash)
    if (el) {
      e.preventDefault()
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="relative bg-bg-secondary border-t border-white/[0.04] py-16 z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-indigo to-accent-violet flex items-center justify-center text-white font-bold text-base shadow-[0_0_15px_rgba(99,102,241,0.25)]">
              S
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Success <span className="gradient-text-accent">English</span>
            </span>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
            Sri Lanka's premier English academy. We empower students with language mastery, elite study materials, and expert guidance to conquer global achievements.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-white font-semibold text-sm tracking-wider uppercase">Quick Links</h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li>
              <Link to="/#courses" onClick={(e) => handleNavClick(e, '/#courses')} className="hover:text-white transition-colors duration-200">All Courses</Link>
            </li>
            <li>
              <Link to="/#about" onClick={(e) => handleNavClick(e, '/#about')} className="hover:text-white transition-colors duration-200">About Our Academy</Link>
            </li>
            <li>
              <Link to="/#contact" onClick={(e) => handleNavClick(e, '/#contact')} className="hover:text-white transition-colors duration-200">Admissions</Link>
            </li>
            <li>
              <Link to="/#contact" onClick={(e) => handleNavClick(e, '/#contact')} className="hover:text-white transition-colors duration-200">Contact Support</Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-white font-semibold text-sm tracking-wider uppercase">Connect</h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-center gap-2">
              <span className="text-accent-indigo">📍</span> Colombo, Sri Lanka
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent-indigo">✉️</span> info@successenglish.lk
            </li>
          </ul>
          <div className="flex items-center gap-4 pt-2">
            <a 
              href="https://facebook.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-accent-indigo/20 hover:border-accent-indigo/50 transition-all duration-300"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
              </svg>
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-accent-indigo/20 hover:border-accent-indigo/50 transition-all duration-300"
              aria-label="YouTube"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-accent-indigo/20 hover:border-accent-indigo/50 transition-all duration-300"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted">
        <div>
          &copy; {currentYear} Success English Academy. All rights reserved.
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}
