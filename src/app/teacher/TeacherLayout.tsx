import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { GraduationCap } from 'lucide-react'

export default function TeacherLayout() {
  const { user, loading } = useAuth()

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

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex">
      {/* Main Workspace Area */}
      <div className="flex-grow flex flex-col min-w-0 min-h-screen">

        {/* Actual Content Outlet */}
        <main className="flex-grow flex flex-col z-10 w-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}