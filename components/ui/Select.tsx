import { SelectHTMLAttributes, ReactNode } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  children: ReactNode
}

export function Select({
  label,
  error,
  helperText,
  className = '',
  id,
  children,
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`block w-full px-3 py-2 border shadow-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 sm:text-sm ${
          error
            ? 'border-neutral-900 focus:ring-neutral-900 focus:border-neutral-900'
            : 'border-neutral-300'
        }`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-sm text-neutral-900">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-neutral-500">{helperText}</p>
      )}
    </div>
  )
}
