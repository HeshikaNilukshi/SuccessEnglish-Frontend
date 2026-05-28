import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Add background blur when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-bg-primary/70 backdrop-blur-xl border-b border-white/[0.05] py-4 shadow-[0_4px_30px_rgba(0,0,0,0.1)]' 
          : 'bg-transparent py-6 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group z-50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-indigo to-accent-violet flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]">
            S
          </div>
          <span className="text-xl font-bold tracking-tight text-white transition-all duration-300">
            Success <span className="gradient-text-accent">English</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-all duration-300 hover:text-white relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-accent-indigo after:to-accent-violet after:transition-all after:duration-300 hover:after:w-full ${
              location.pathname === '/' ? 'text-white after:w-full' : 'text-text-secondary'
            }`}
          >
            Home
          </Link>
          <a 
            href="#courses" 
            className="text-sm font-medium text-text-secondary transition-all duration-300 hover:text-white relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-accent-indigo after:to-accent-violet after:transition-all after:duration-300 hover:after:w-full"
          >
            Courses
          </a>
          <a 
            href="#about" 
            className="text-sm font-medium text-text-secondary transition-all duration-300 hover:text-white relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-accent-indigo after:to-accent-violet after:transition-all after:duration-300 hover:after:w-full"
          >
            About Us
          </a>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <button 
            type="button"
            className="relative overflow-hidden px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-white/5 border border-white/10 hover:border-accent-indigo/50 hover:bg-accent-indigo/10 shadow-sm transition-all duration-300 cursor-pointer"
          >
            Sign In
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none z-50 cursor-pointer hover:bg-white/10 transition-colors"
          aria-label="Toggle Menu"
        >
          <div className="w-5 flex flex-col gap-1.5">
            <span className={`block h-[2px] w-full bg-white rounded transition-transform duration-300 origin-center ${isOpen ? 'rotate-45 translate-y-[5px]' : ''}`}></span>
            <span className={`block h-[2px] w-full bg-white rounded transition-all duration-300 ${isOpen ? 'opacity-0 scale-x-0' : ''}`}></span>
            <span className={`block h-[2px] w-full bg-white rounded transition-transform duration-300 origin-center ${isOpen ? '-rotate-45 -translate-y-[5px]' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`fixed inset-0 bg-bg-primary/90 backdrop-blur-2xl transition-all duration-500 md:hidden flex flex-col justify-center items-center z-40 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col items-center gap-8 text-2xl font-bold text-center">
          <Link 
            to="/" 
            className={`transition-colors hover:text-accent-indigo ${location.pathname === '/' ? 'text-white' : 'text-text-secondary'}`}
          >
            Home
          </Link>
          <a 
            href="#courses" 
            className="text-text-secondary transition-colors hover:text-accent-indigo"
            onClick={() => setIsOpen(false)}
          >
            Courses
          </a>
          <a 
            href="#about" 
            className="text-text-secondary transition-colors hover:text-accent-indigo"
            onClick={() => setIsOpen(false)}
          >
            About Us
          </a>
          <button 
            type="button"
            className="mt-8 px-8 py-3.5 rounded-full text-base font-bold text-white bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300 w-48"
          >
            Sign In
          </button>
        </nav>
      </div>
    </header>
  )
}
