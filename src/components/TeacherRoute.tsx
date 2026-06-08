import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function TeacherRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center relative text-text-primary overflow-hidden">
        <div className="absolute inset-0 radial-glow-main pointer-events-none z-0" />
        <div className="absolute inset-0 dot-pattern pointer-events-none z-0 opacity-50" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo via-accent-violet to-accent-pink opacity-90 animate-pulse" />
            <span className="relative text-white font-extrabold text-lg select-none">T</span>
          </div>
          <p className="text-sm font-semibold tracking-wider text-text-secondary animate-pulse uppercase">
            Verifying Session...
          </p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'TEACHER') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
