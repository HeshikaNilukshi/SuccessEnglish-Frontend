import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const NAV_LINKS = [
  { label: 'Courses', to: '/#courses' },
  { label: 'About', to: '/#about' },
  { label: 'Contact Us', to: '/#contact' },
]

export default function Navbar() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeHash, setActiveHash] = useState('')
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setIsOpen(false) }, [location])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveHash('#' + entry.target.id)
        }
      },
      { threshold: 0.5 }
    )
    NAV_LINKS.forEach(({ to }) => {
      const el = document.getElementById(to.split('#')[1])
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const isActive = (to: string) =>
    to.includes('#') && activeHash === '#' + to.split('#')[1]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    if (!to.includes('#')) return
    const el = document.getElementById(to.split('#')[1])
    if (el) {
      e.preventDefault()
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navLinkClass = (to: string) =>
    'relative px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ' +
    (isActive(to)
      ? 'text-text-primary bg-black/5'
      : 'text-text-secondary hover:text-text-primary hover:bg-black/5')

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ${
          scrolled ? 'pt-3' : 'pt-5'
        }`}
      >
        <div
          className={`relative flex items-center justify-between gap-8 rounded-2xl mx-6 px-4 py-2.5 transition-all duration-500 w-full max-w-7xl ${
            scrolled
              ? 'bg-bg-secondary/80 backdrop-blur-2xl border border-border-subtle shadow-[0_8px_32px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0, 0, 0, 0.05)]'
              : 'bg-transparent border border-transparent'
          }`}
        >
          {scrolled && (
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
          )}

          <Link
            to="/"
            className="flex items-center gap-3 group shrink-0 z-50"
            onClick={(e) => {
              setActiveHash('')
              if (location.pathname === '/') {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
          >
            <div className="relative w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo via-accent-violet to-accent-pink opacity-90" />
              <span className="relative text-white font-extrabold text-base tracking-tight select-none">S</span>
              <span className="absolute top-0.5 left-1 w-3 h-1 bg-black/5 rounded-full blur-[2px]" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-text-primary/90 whitespace-nowrap">
              Success <span className="gradient-text-accent font-bold">English</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.to}
                className={navLinkClass(link.to)}
                onClick={(e) => handleNavClick(e, link.to)}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-gradient-to-r from-accent-indigo to-accent-violet" />
                )}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link
              to={user ? (user.role === 'TEACHER' ? '/teacher' : user.role === 'ADMIN' ? '/admin' : '/student') : '/login'}
              className="group relative px-5 py-2 text-sm font-semibold rounded-xl overflow-hidden cursor-pointer"
            >
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-violet opacity-[0.15] group-hover:opacity-[0.25] transition-opacity duration-300" />
              <span className="absolute inset-[1px] rounded-[11px] bg-bg-secondary" />
              <span className="relative text-text-primary/80 group-hover:text-text-primary transition-colors duration-200">Sign In</span>
            </Link>
            <Link
              to={user ? (user.role === 'TEACHER' ? '/teacher' : user.role === 'ADMIN' ? '/admin' : '/student') : '/register'}
              className="relative px-5 py-2 text-sm font-semibold rounded-xl text-white overflow-hidden cursor-pointer group"
            >
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-violet" />
              <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.15)_50%,transparent_60%)] bg-[length:200%_100%]" />
              <span className="relative">Get Started</span>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden z-50 flex flex-col justify-center items-center w-9 h-9 rounded-lg text-text-primary focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            <span className={`block h-[1.5px] w-5 bg-text-primary rounded-full transition-all duration-300 origin-center ${isOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
            <span className={`block h-[1.5px] w-5 bg-text-primary rounded-full mt-[5px] transition-all duration-300 origin-center ${isOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 md:hidden flex flex-col transition-all duration-500 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(248, 250, 252, 0.97)', backdropFilter: 'blur(24px)' }}
      >
        <div className="absolute inset-0 radial-glow-main pointer-events-none" />
        <nav className="flex flex-col items-center justify-center h-full gap-2">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.to}
              className={`text-3xl font-bold transition-all duration-200 px-8 py-3 rounded-2xl ${
                isActive(link.to) ? 'text-text-primary bg-black/5' : 'text-text-primary/50 hover:text-text-primary hover:bg-black/5'
              }`}
              style={{ transitionDelay: `${i * 40}ms` }}
              onClick={(e) => { setIsOpen(false); handleNavClick(e, link.to) }}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col items-center gap-3 mt-10 w-full px-10">
            <Link
              to={user ? (user.role === 'TEACHER' ? '/teacher' : user.role === 'ADMIN' ? '/admin' : '/student') : '/login'}
              className="w-full max-w-xs py-3.5 rounded-2xl text-base font-semibold text-text-primary/80 border border-border-subtle hover:border-accent-indigo/40 hover:text-text-primary transition-all duration-200 cursor-pointer text-center"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
            <Link
              to={user ? (user.role === 'TEACHER' ? '/teacher' : user.role === 'ADMIN' ? '/admin' : '/student') : '/register'}
              className="relative w-full max-w-xs py-3.5 rounded-2xl text-base font-bold text-white overflow-hidden cursor-pointer text-center"
              onClick={() => setIsOpen(false)}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-accent-indigo to-accent-violet rounded-2xl" />
              <span className="relative">Get Started</span>
            </Link>
          </div>
        </nav>
      </div>
    </>
  )
}