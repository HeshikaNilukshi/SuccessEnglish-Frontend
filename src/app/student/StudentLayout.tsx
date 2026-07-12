import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function StudentLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center relative text-text-primary overflow-hidden">
        <div className="absolute inset-0 radial-glow-main pointer-events-none z-0" />
        <div className="absolute inset-0 dot-pattern pointer-events-none z-0 opacity-50" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo via-accent-violet to-accent-pink opacity-90 animate-pulse" />
            <span className="relative text-white font-extrabold text-lg select-none">S</span>
          </div>
          <p className="text-sm font-semibold tracking-wider text-text-secondary animate-pulse uppercase">
            Verifying Session...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-bg-primary text-text-primary selection:bg-accent-indigo/30">
      <div className="absolute inset-0 radial-glow-main pointer-events-none z-0" />
      <div className="absolute inset-0 dot-pattern pointer-events-none z-0 opacity-50" />
      <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-accent-indigo/8 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-20%] w-[500px] h-[500px] bg-accent-violet/6 rounded-full blur-[160px] pointer-events-none z-0" />

      <main className="relative flex-grow z-10 w-full">
        <Outlet />
      </main>
    </div>
  )
}
