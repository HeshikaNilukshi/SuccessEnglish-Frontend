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
}

export default function PageShell({
  children,
  title,
  subtitle,
  breadcrumbs,
  actions,
  maxWidthClass = 'max-w-7xl',
}: PageShellProps) {
  return (
    <div className="w-full min-h-screen flex flex-col relative z-10">

      {/* ══════════════════════════════════════════════════════
          HEADER BANNER — full-width, rich gradient treatment
      ══════════════════════════════════════════════════════ */}
      <header className="w-full relative overflow-hidden">

        {/* Base gradient — deep navy-indigo → vivid blue */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1e4a] via-[#1a3280] to-[#2563eb]" />

        {/* Mesh / noise layer */}
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
        <div className="absolute top-1/2 -translate-y-1/2 right-1/4 w-32 h-32 rounded-full bg-sky-400/20 blur-[40px] pointer-events-none" />

        {/* Faint grid lines overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Bottom fade edge blending into page */}
        <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-b from-transparent to-bg-primary/30 pointer-events-none" />

        {/* ── Content ── */}
        <div className={`relative w-full ${maxWidthClass} mx-auto px-6 md:px-12 z-10`}>

          {/* Top row: breadcrumbs + actions */}
          <div className="flex items-center justify-between pt-5 pb-0 min-h-[48px]">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
              <Home className="w-3.5 h-3.5 text-white/40 shrink-0" />
              {breadcrumbs.map((item, idx) => {
                const isLast = idx === breadcrumbs.length - 1
                return (
                  <React.Fragment key={idx}>
                    <ChevronRight className="w-3 h-3 text-white/30 shrink-0" />
                    {isLast || !item.href ? (
                      <span className="text-[11px] font-semibold text-white/90 tracking-wide uppercase">
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        to={item.href}
                        className="text-[11px] font-medium text-white/55 hover:text-white/90 transition-colors duration-200 tracking-wide uppercase"
                      >
                        {item.label}
                      </Link>
                    )}
                  </React.Fragment>
                )
              })}
            </nav>

            {/* Actions */}
            {actions && (
              <div className="flex items-center gap-3 shrink-0">
                {actions}
              </div>
            )}
          </div>

          {/* Page title + subtitle */}
          <div className="pb-10 pt-6 animate-fade-in-up">
            <h1 className="text-3xl md:text-[2.75rem] font-extrabold tracking-tight text-white leading-tight drop-shadow-sm">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2.5 text-sm md:text-[0.9375rem] text-white/60 max-w-xl leading-relaxed font-medium">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════ */}
      <main
        className={`w-full ${maxWidthClass} mx-auto px-6 md:px-12 py-10 flex-grow flex flex-col animate-fade-in-up [animation-delay:80ms]`}
      >
        {children}
      </main>
    </div>
  )
}
