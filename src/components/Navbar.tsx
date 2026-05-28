import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Home', to: '/', type: 'link' as const },
  { label: 'Courses', href: '#courses', type: 'anchor' as const },
  { label: 'About', href: '#about', type: 'anchor' as const },
  { label: 'Contact Us', href: '#contact', type: 'anchor' as const },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* ── Main Header ───────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ${
          scrolled ? 'pt-3' : 'pt-5'
        }`}
      >
        {/* Floating pill container */}
        <div
          className={`relative flex items-center justify-between gap-8 rounded-2xl mx-6 px-4 py-2.5 transition-all duration-500 w-full max-w-7xl ${
            scrolled
              ? 'bg-[#060813]/80 backdrop-blur-2xl border border-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.03)]'
              : 'bg-transparent border border-transparent'
          }`}
        >
          {/* Subtle inner top-edge glow when scrolled */}
          {scrolled && (
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
          )}

          {/* ── Brand ────────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-3 group shrink-0 z-50">
            {/* Logo mark */}
            <div className="relative w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo via-accent-violet to-accent-pink opacity-90" />
              <span className="relative text-white font-extrabold text-base tracking-tight select-none">S</span>
              {/* Glint */}
              <span className="absolute top-0.5 left-1 w-3 h-1 bg-white/25 rounded-full blur-[2px]" />
            </div>

            {/* Wordmark */}
            <span className="text-[15px] font-semibold tracking-tight text-white/90 whitespace-nowrap">
              Success{' '}
              <span className="gradient-text-accent font-bold">English</span>
            </span>
          </Link>

          {/* ── Desktop Nav ──────────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = link.type === 'link' && location.pathname === link.to
              const baseClass =
                'relative px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 '

              if (link.type === 'link') {
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    className={
                      baseClass +
                      (isActive
                        ? 'text-white bg-white/[0.08]'
                        : 'text-text-secondary hover:text-white hover:bg-white/[0.05]')
                    }
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-gradient-to-r from-accent-indigo to-accent-violet" />
                    )}
                  </Link>
                )
              }

              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={baseClass + 'text-text-secondary hover:text-white hover:bg-white/[0.05]'}
                >
                  {link.label}
                </a>
              )
            })}
          </nav>

          {/* ── Desktop CTA ──────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              type="button"
              className="group relative px-5 py-2 text-sm font-semibold rounded-xl overflow-hidden cursor-pointer"
            >
              {/* Gradient border via pseudo-element trick */}
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-violet opacity-[0.15] group-hover:opacity-[0.25] transition-opacity duration-300" />
              <span className="absolute inset-[1px] rounded-[11px] bg-[#060813]" />
              <span className="relative text-white/80 group-hover:text-white transition-colors duration-200">
                Sign In
              </span>
            </button>

            <button
              type="button"
              className="relative px-5 py-2 text-sm font-semibold rounded-xl text-white overflow-hidden cursor-pointer group"
            >
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-violet" />
              {/* Shine sweep */}
              <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.15)_50%,transparent_60%)] bg-[length:200%_100%]" />
              <span className="relative">Get Started</span>
            </button>
          </div>

          {/* ── Mobile Hamburger ─────────────────────────────────── */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden z-50 flex flex-col justify-center items-center w-9 h-9 rounded-lg text-white focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            <span
              className={`block h-[1.5px] w-5 bg-white/80 rounded-full transition-all duration-300 origin-center ${
                isOpen ? 'rotate-45 translate-y-[3.5px]' : ''
              }`}
            />
            <span
              className={`block h-[1.5px] w-5 bg-white/80 rounded-full mt-[5px] transition-all duration-300 origin-center ${
                isOpen ? '-rotate-45 -translate-y-[3.5px]' : ''
              }`}
            />
          </button>
        </div>
      </header>

      {/* ── Mobile Full-Screen Menu ───────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 md:hidden flex flex-col transition-all duration-500 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(6,8,19,0.97)', backdropFilter: 'blur(24px)' }}
      >
        {/* Decorative radial glow */}
        <div className="absolute inset-0 radial-glow-main pointer-events-none" />

        <nav className="flex flex-col items-center justify-center h-full gap-2">
          {NAV_LINKS.map((link, i) => {
            const isActive = link.type === 'link' && location.pathname === link.to
            const sharedClass = `text-3xl font-bold transition-all duration-200 px-8 py-3 rounded-2xl ${
              isActive
                ? 'text-white bg-white/[0.06]'
                : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
            }`
            return link.type === 'link' ? (
              <Link
                key={link.label}
                to={link.to}
                className={sharedClass}
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className={sharedClass}
                onClick={() => setIsOpen(false)}
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {link.label}
              </a>
            )
          })}

          {/* Mobile CTAs */}
          <div className="flex flex-col items-center gap-3 mt-10 w-full px-10">
            <button
              type="button"
              className="w-full max-w-xs py-3.5 rounded-2xl text-base font-semibold text-white/80 border border-white/10 hover:border-accent-indigo/40 hover:text-white transition-all duration-200 cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              className="relative w-full max-w-xs py-3.5 rounded-2xl text-base font-bold text-white overflow-hidden cursor-pointer"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-accent-indigo to-accent-violet rounded-2xl" />
              <span className="relative">Get Started</span>
            </button>
          </div>
        </nav>
      </div>

    </>
  )
}
