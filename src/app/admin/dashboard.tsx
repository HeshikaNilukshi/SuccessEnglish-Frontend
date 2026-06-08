import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import ProfilePopover from '@/components/ui/ProfilePopover'

export default function AdminDashboard() {
  const { user } = useAuth()

  const navItems = [
    {
      title: 'Verify Enrollments',
      desc: 'Verify student receipts and approve enrollment requests.',
      path: '/admin/enrollments',
      icon: '💳',
      color: 'from-accent-violet to-accent-indigo',
    },
    {
      title: 'Manage Admins',
      desc: 'Create, update, and delete administrative accounts.',
      path: '/admin/admins',
      icon: '🔐',
      color: 'from-accent-indigo to-accent-violet',
    },
    {
      title: 'Manage Teachers',
      desc: 'Create, update, and delete teacher accounts.',
      path: '/admin/teachers',
      icon: '👨‍🏫',
      color: 'from-accent-violet to-accent-pink',
    },
    {
      title: 'Manage Students',
      desc: 'Create, update, and delete student accounts.',
      path: '/admin/students',
      icon: '🎓',
      color: 'from-accent-pink to-accent-indigo',
    },
    {
      title: 'View Courses',
      desc: 'View all courses and enrolled students.',
      path: '/admin/courses',
      icon: '📚',
      color: 'from-accent-indigo to-accent-pink',
    },
    {
      title: 'My Profile',
      desc: 'View and update your personal information.',
      path: '/admin/profile',
      icon: '👤',
      color: 'from-accent-pink to-accent-violet',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-12">
      <header className="relative z-20 flex flex-col gap-4 mb-10 border-b border-white/[0.04] pb-6 animate-fade-in-up">
        <div>
          <Link
            to="/"
            className="text-xs text-text-muted hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer"
          >
            &larr; Back to home portal
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
                Admin <span className="gradient-text-accent">Dashboard</span>
              </h1>
              <p className="text-text-secondary text-sm md:text-base">
                Welcome back, {user?.name}. Manage users, courses, and verify enrollments.
              </p>
            </div>
            <ProfilePopover user={user} />
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up animate-delay-100">
        {navItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className="group relative flex flex-col justify-between rounded-2xl glass-panel p-7 text-left hover:-translate-y-1 hover:border-white/10 active:scale-[0.98] transition-all duration-300 shadow-xl cursor-pointer"
          >
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/20 to-transparent" />
            
            <div className="space-y-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl shadow-lg shadow-accent-indigo/10`}>
                {item.icon}
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-white group-hover:text-accent-indigo transition-colors duration-200">
                  {item.title}
                </h2>
                <p className="text-xs text-text-secondary leading-relaxed mt-1">
                  {item.desc}
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/[0.04] flex items-center justify-end text-xs font-semibold text-accent-indigo group-hover:text-white transition-colors duration-200">
              Manage &rarr;
            </div>
          </Link>
        ))}
      </main>
    </div>
  )
}
