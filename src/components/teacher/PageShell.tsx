import * as React from 'react'
import { Link } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'

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
  maxWidthClass?: string // Optional override, e.g., for narrower forms
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
    <div className={`w-full ${maxWidthClass} mx-auto px-6 md:px-12 pt-10 pb-12 min-h-screen flex flex-col justify-between relative z-10`}>
      <div className="flex-grow flex flex-col">
        {/* Breadcrumbs */}
        <header className="mb-6 animate-fade-in-up">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              {breadcrumbs.map((item, idx) => {
                const isLast = idx === breadcrumbs.length - 1
                return (
                  <React.Fragment key={idx}>
                    <BreadcrumbItem>
                      {isLast || !item.href ? (
                        <BreadcrumbPage className="text-text-primary font-medium">
                          {item.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          render={<Link to={item.href} />}
                          className="text-text-muted hover:text-text-primary transition-colors text-xs"
                        >
                          {item.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header Title and Actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-primary">
                {title}
              </h1>
              {subtitle && (
                <p className="text-text-secondary text-sm md:text-base max-w-3xl leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && <div className="flex items-center gap-3 shrink-0 self-start md:self-center">{actions}</div>}
          </div>
          <Separator className="bg-border-subtle" />
        </header>

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col animate-fade-in-up [animation-delay:100ms]">
          {children}
        </main>
      </div>
    </div>
  )
}
