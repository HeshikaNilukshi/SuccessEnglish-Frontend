import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import ProfilePopover from '@/components/ui/ProfilePopover'
import PageShell from '@/components/teacher/PageShell'

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

const pageTitle = (
  <>
    Admin <span className="gradient-text-accent">Dashboard</span>
  </>
)

const breadcrumbs = [
  { label: 'Home' }
]

export default function AdminDashboard() {
  const { user } = useAuth()

  return (
    <PageShell
      title={pageTitle}
      subtitle={`Welcome back, ${user?.name || ''}. Manage users, courses, and verify enrollments.`}
      breadcrumbs={breadcrumbs}
      actions={<ProfilePopover />}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
        {navItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className="group relative flex flex-col justify-between rounded-2xl glass-panel p-7 text-left hover:-translate-y-1 hover:border-border-subtle active:scale-[0.98] transition-all duration-300 shadow-xl cursor-pointer"
          >
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/20 to-transparent" />

            <div className="space-y-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl shadow-lg shadow-accent-indigo/10`}>
                {item.icon}
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-text-primary group-hover:text-accent-indigo transition-colors duration-200">
                  {item.title}
                </h2>
                <p className="text-xs text-text-secondary leading-relaxed mt-1">
                  {item.desc}
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-border-subtle flex items-center justify-end text-xs font-semibold text-accent-indigo group-hover:text-text-primary transition-colors duration-200">
              Manage &rarr;
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  )
}
