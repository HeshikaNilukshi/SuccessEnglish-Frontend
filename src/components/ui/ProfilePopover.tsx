import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SignOutModal from './SignOutModal'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

export default function ProfilePopover({ user }: { user: User | null }) {
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="relative z-30 self-start sm:self-auto">
      <DropdownMenu>
        <DropdownMenuTrigger
          type="button"
          className="flex items-center gap-4 bg-black/5 p-3 rounded-2xl hover:bg-black/5 active:scale-[0.98] transition-all cursor-pointer select-none text-left focus:outline-none"
        >
          <div className="relative w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-accent-indigo to-accent-violet shrink-0">
            <span className="text-white font-bold text-base uppercase">
              {user?.name?.charAt(0) ?? 'U'}
            </span>
          </div>
          <div className="text-left leading-tight pr-1">
            <p className="text-sm font-semibold text-text-primary truncate max-w-[120px]">{user?.name}</p>
            <p className="text-[11px] text-text-muted truncate max-w-[120px]">{user?.email}</p>
          </div>
          <svg
            className="w-4 h-4 text-text-muted transition-transform duration-200 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="mt-3 w-52 rounded-2xl overflow-hidden bg-bg-secondary/90 backdrop-blur-2xl shadow-[0_16px_48px_rgba(0,0,0,0.6),0_0_0_1px_rgba(0,0,0,0.05)] p-2 space-y-0.5">
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/40 to-transparent" />

          <DropdownMenuItem
            onClick={() => {
              const path = user?.role === 'TEACHER' ? '/teacher/profile' : user?.role === 'ADMIN' ? '/admin/profile' : '/student/profile'
              navigate(path)
            }}
            className="relative z-10 group w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left cursor-pointer hover:bg-accent-indigo/10 outline-none border-none"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg group-hover:bg-accent-indigo/20 transition-colors duration-150 shrink-0">
              <svg className="w-4 h-4 text-accent-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <span className="text-sm font-semibold text-text-secondary group-hover:text-text-primary transition-colors duration-150">
              My Profile
            </span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border-subtle mx-1 my-1" />

          <DropdownMenuItem
            onClick={() => setIsSignOutModalOpen(true)}
            className="relative z-10 group w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left cursor-pointer hover:bg-red-500/10 outline-none border-none"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg group-hover:bg-red-500/20 transition-colors duration-150 shrink-0">
              <svg className="w-4 h-4 text-red-900 font-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3h4a3 3 0 013 3v1" />
              </svg>
            </span>
            <span className="text-sm text-text-secondary group-hover:text-red-900 font-medium transition-colors duration-150">
              Sign Out
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
      />
    </div>
  )
}