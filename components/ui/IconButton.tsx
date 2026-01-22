import { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'ghost' | 'danger'
  size?: 'sm' | 'md'
}

export function IconButton({
  children,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}: IconButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantStyles = {
    ghost: 'text-neutral-600 hover:bg-neutral-100 focus:ring-neutral-500',
    danger: 'text-neutral-900 hover:bg-neutral-100 focus:ring-neutral-500',
  }

  const sizeStyles = {
    sm: 'p-1',
    md: 'p-2',
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
