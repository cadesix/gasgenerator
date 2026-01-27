'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'

interface Breadcrumb {
  label: string
  href?: string
}

interface DetailPageLayoutProps {
  title: string
  projectName: string
  formatName?: string | null
  additionalBadges?: ReactNode
  actions?: ReactNode
  overflowMenu?: ReactNode
  children: ReactNode
  footer?: ReactNode
  breadcrumbs?: Breadcrumb[]
  showBackButton?: boolean
}

export function DetailPageLayout({
  title,
  projectName,
  formatName,
  additionalBadges,
  actions,
  overflowMenu,
  children,
  footer,
  breadcrumbs,
  showBackButton = true,
}: DetailPageLayoutProps) {
  const router = useRouter()

  const hasBreadcrumbs = breadcrumbs && breadcrumbs.length > 0
  const shouldShowNav = showBackButton || hasBreadcrumbs

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button and Breadcrumbs */}
      {shouldShowNav && (
        <div className="mb-6 flex items-center gap-3">
          {/* Back Button */}
          {showBackButton && (
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-neutral-100 transition-colors group"
              aria-label="Go back"
            >
              <svg
                className="w-5 h-5 text-neutral-400 group-hover:text-neutral-900 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          )}

          {/* Breadcrumbs */}
          {hasBreadcrumbs && (
            <nav className="flex items-center gap-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && (
                    <svg
                      className="w-4 h-4 text-neutral-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                  {crumb.href ? (
                    <button
                      onClick={() => router.push(crumb.href!)}
                      className="text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="text-neutral-900 font-medium">{crumb.label}</span>
                  )}
                </div>
              ))}
            </nav>
          )}
        </div>
      )}

      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold text-neutral-900">
              {title}
            </h1>
            {overflowMenu && overflowMenu}
          </div>
          <div className="flex gap-2">
            <Badge variant="default">{projectName}</Badge>
            {formatName && (
              <Badge variant="success">{formatName}</Badge>
            )}
            {additionalBadges}
          </div>
        </div>
        {actions && (
          <div className="flex gap-3">
            {actions}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {children}
      </div>

      {footer && (
        <div className="mt-6">
          {footer}
        </div>
      )}
    </div>
  )
}
