'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'

interface OverflowMenuProps {
  children: ReactNode
}

export function OverflowMenu({ children }: OverflowMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-neutral-100 transition-colors"
        aria-label="More options"
      >
        <svg
          className="h-5 w-5 text-neutral-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-300 shadow-lg z-10">
          <div className="py-1" onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

interface OverflowMenuItemProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'default' | 'danger'
}

export function OverflowMenuItem({ children, onClick, variant = 'default' }: OverflowMenuItemProps) {
  const variantStyles = {
    default: 'text-neutral-900 hover:bg-neutral-100',
    danger: 'text-red-600 hover:bg-red-50',
  }

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-sm ${variantStyles[variant]}`}
    >
      {children}
    </button>
  )
}
