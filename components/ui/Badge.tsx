import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'danger' | 'warning'
  className?: string
}

export function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-neutral-100 text-neutral-800',
    success: 'bg-neutral-100 text-neutral-800',
    danger: 'bg-neutral-100 text-neutral-800',
    warning: 'bg-neutral-100 text-neutral-800',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-neutral-300 ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
