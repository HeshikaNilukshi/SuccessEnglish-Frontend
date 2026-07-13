import * as React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItemType {
  label: string
  href?: string
}

interface PageShellProps {
  children: React.ReactNode
  title: string | React.ReactNode
  subtitle?: string | React.ReactNode
  breadcrumbs: BreadcrumbItemType[]
  actions?: React.ReactNode
  maxWidthClass?: string
  homeHref?: string
}

export default function PageShell({
  children,
  title,
  subtitle,
  breadcrumbs,
  actions,
  maxWidthClass = 'max-w-7xl',
  homeHref,
}: PageShellProps) {
  return (
    <div className="w-full flex flex-col min-h-screen bg-bg-primary">
      {/* Sleek Minimal Header */}
      <header className="relative overflow-hidden border-b border-border-subtle py-6 px-6 md:px-12">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1e4a] via-[#1a3280] to-[#2563eb]" />

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        {/* Radial light orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-400/20 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-indigo-300/15 blur-[60px] pointer-events-none" />

        {/* Content */}
        <div className={`relative mx-auto ${maxWidthClass} space-y-4 z-10`}>
          {/* Top Row: Breadcrumbs and Mobile Actions */}
          <div className="flex items-center justify-between gap-4">
            <nav className="flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
              <Link to={homeHref || "/teacher"} className="text-white/40 hover:text-white/80 transition-colors">
                <Home className="w-3.5 h-3.5" />
              </Link>
              {breadcrumbs.map((item, idx) => {
                const isLast = idx === breadcrumbs.length - 1
                return (
                  <React.Fragment key={idx}>
                    <ChevronRight className="w-3 h-3 text-white/30 shrink-0" />
                    {isLast || !item.href ? (
                      <span className="text-xs font-bold text-white/90">
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        to={item.href}
                        className="text-xs font-bold text-white/55 hover:text-white/90 transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </React.Fragment>
                )
              })}
            </nav>
            
            {/* Actions (Mobile Only) */}
            {actions && (
              <div className="flex md:hidden items-center gap-3 shrink-0">
                {actions}
              </div>
            )}
          </div>

          {/* Title Row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm font-medium text-white/60">
                  {subtitle}
                </p>
              )}
            </div>
            
            {/* Actions (Desktop Only) */}
            {actions && (
              <div className="hidden md:flex items-center gap-3 shrink-0">
                {actions}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow py-8 px-6 md:px-12 flex flex-col">
        <div className={`mx-auto ${maxWidthClass} flex-grow w-full flex flex-col`}>
          {children}
        </div>
      </main>
    </div>
  )
}
