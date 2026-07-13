import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { formatDate } from '@/lib/utils'
import ProfileForm from '@/components/profile-form'
import SignOutModal from '@/components/ui/SignOutModal'
import PageShell from '@/components/teacher/PageShell'

export default function ProfilePage() {
  const { user } = useAuth()
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false)

  const backTarget = user?.role === 'TEACHER' ? '/teacher' : user?.role === 'ADMIN' ? '/admin' : '/student'
  const isStudent = user?.role === 'STUDENT' || !user?.role

  return (
    <PageShell
      title={<>My <span className="text-accent-indigo">Profile</span></>}
      subtitle="Manage your personal details and account settings."
      breadcrumbs={[
        { label: 'Dashboard', href: backTarget },
        { label: 'Profile' }
      ]}
      maxWidthClass="max-w-7xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fade-in-up" style={{ animationDelay: '100ms' }}>

        <div className="lg:col-span-4">
          <div className="relative overflow-hidden rounded-2xl bg-bg-secondary border border-border-subtle p-8 shadow-sm text-center group h-full flex flex-col justify-between">
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-3xl bg-accent-indigo/10">
                <span className="text-accent-indigo font-extrabold text-3xl uppercase">
                  {user?.name?.charAt(0) ?? 'U'}
                </span>
              </div>

              <div className="space-y-3 w-full">
                <h2 className="text-2xl font-bold text-text-primary tracking-tight">{user?.name}</h2>

                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-text-muted">
                    {isStudent ? 'Student ID' : 'User ID'}
                  </div>
                  <div className="font-mono text-sm md:text-base font-semibold text-text-primary bg-black/5 border border-border-subtle px-3.5 py-1.5 rounded-xl select-all inline-block max-w-full truncate">
                    {user?.id}
                  </div>
                </div>

                <div className="text-xs text-text-secondary truncate max-w-full px-2">
                  {user?.email}
                </div>

                <div className="text-xs text-text-muted">
                  Joined on <span className="text-text-secondary font-medium">{formatDate(user?.createdAt || '')}</span>
                </div>

                <div className="pt-2 flex justify-center">
                  <span className="text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/25">
                    {user?.role || 'STUDENT'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border-subtle w-full">
              <button
                type="button"
                onClick={() => setIsSignOutModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs text-red-900 font-medium hover:text-red-300 bg-red-500/12 hover:bg-red-500/10 border border-red-500/25 hover:border-red-500/25 transition-all active:scale-[0.98] cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ProfileForm />
        </div>

      </div>

      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
      />
    </PageShell>
  )
}
