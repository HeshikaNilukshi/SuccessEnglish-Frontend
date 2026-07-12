import { useState } from 'react'
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import ProfilePopover from '@/components/ui/ProfilePopover'
import {
  LayoutDashboard,
  BookOpen,
  Menu,
  X,
  GraduationCap
} from 'lucide-react'

export default function TeacherLayout() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center text-text-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent-indigo flex items-center justify-center shadow-lg shadow-accent-indigo/20 animate-pulse">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <p className="text-xs font-bold tracking-widest text-text-secondary uppercase animate-pulse">
            Verifying Session...
          </p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'TEACHER') {
    return <Navigate to="/login" replace />
  }

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/teacher',
      icon: LayoutDashboard,
      active: location.pathname === '/teacher'
    },
    {
      label: 'My Courses',
      href: '/teacher', // Both dashboard and courses are managed here, or we can make it active if we are nested in courses
      icon: BookOpen,
      active: location.pathname.startsWith('/teacher') && location.pathname !== '/teacher' && !location.pathname.includes('/profile')
    }
  ]

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex">
      {/* Desktop Sidebar */}
      <aside className="hidden flex-col w-64 bg-bg-secondary/80 border-r border-border-subtle h-screen sticky top-0">
        {/* Brand / Logo */}
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-border-subtle">
          <div className="w-8 h-8 rounded-lg bg-accent-indigo flex items-center justify-center shadow-md shadow-accent-indigo/10">
            <GraduationCap className="text-white w-5 h-5" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-text-primary">
            Teacher Portal
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-grow p-4 space-y-1.5 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                  item.active
                    ? 'bg-accent-indigo/10 text-accent-indigo'
                    : 'text-text-secondary hover:text-text-primary hover:bg-black/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${item.active ? 'text-accent-indigo' : 'text-text-muted'}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User Profile at bottom */}
        <div className="p-4 border-t border-border-subtle">
          <ProfilePopover />
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-bg-secondary h-full shadow-2xl animate-slide-in-left">
            <div className="h-16 flex items-center justify-between px-6 border-b border-border-subtle">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-accent-indigo flex items-center justify-center">
                  <GraduationCap className="text-white w-5 h-5" />
                </div>
                <span className="font-extrabold text-base tracking-tight text-text-primary">Portal</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-lg hover:bg-black/5">
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            <nav className="flex-grow p-4 space-y-1.5 mt-4">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                      item.active
                        ? 'bg-accent-indigo/10 text-accent-indigo'
                        : 'text-text-secondary hover:text-text-primary hover:bg-black/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="p-4 border-t border-border-subtle">
              <ProfilePopover />
            </div>
          </aside>
        </div>
      )}

      {/* Main Workspace Area */}
      <div className="flex-grow flex flex-col min-w-0 min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-bg-secondary border-b border-border-subtle flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-2.5">
            <button onClick={() => setIsMobileMenuOpen(true)} className="hidden p-1 rounded-lg hover:bg-black/5">
              <Menu className="w-5 h-5 text-text-primary" />
            </button>
            <span className="font-extrabold text-sm tracking-tight text-text-primary">
              Teacher Portal
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-accent-indigo/10 border border-accent-indigo/20 flex items-center justify-center font-bold text-accent-indigo text-xs">
            {user.name ? user.name.charAt(0).toUpperCase() : 'T'}
          </div>
        </header>

        {/* Actual Content Outlet */}
        <main className="flex-grow flex flex-col z-10 w-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
