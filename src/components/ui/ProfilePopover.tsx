import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { User, LogOut } from 'lucide-react'
import SignOutModal from './SignOutModal'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

export default function ProfilePopover() {
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false)
  const { user } = useAuth()
  
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white/90 hover:text-white hover:bg-white/20 transition-all cursor-pointer focus:outline-none flex items-center justify-center font-bold text-sm shadow-sm">
          {initials}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-bg-secondary border border-border-subtle rounded-2xl shadow-xl p-1.5 animate-popover-in">
          <div className="px-4 py-3 mb-1.5 border-b border-border-subtle">
            <p className="text-sm font-bold text-text-primary truncate">{user?.name}</p>
            <p className="text-xs font-medium text-text-secondary truncate">{user?.email}</p>
          </div>
          <Link to={user?.role === 'TEACHER' ? '/teacher/profile' : user?.role === 'ADMIN' ? '/admin/profile' : '/student/profile'}>
            <DropdownMenuItem className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl text-text-primary hover:bg-black/5 transition-all cursor-pointer outline-none w-full">
              <User className="w-4 h-4" /> Edit Profile
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            onClick={() => setIsSignOutModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl text-red-600 hover:bg-red-500/10 transition-all cursor-pointer outline-none mt-1"
          >
            <LogOut className="w-4 h-4" /> Sign Out
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