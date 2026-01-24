import { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Textarea({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`${className}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`block w-full px-3 py-2 border bg-white text-neutral-900 focus:outline-none sm:text-sm rounded-2xl ${
          error
            ? 'border-neutral-900'
            : 'border-neutral-300'
        }`}
        rows={4}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-neutral-900">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-neutral-500">{helperText}</p>
      )}
    </div>
  )
}
