'use client'

import { useState, useEffect } from 'react'

interface PromptHistoryItem {
  id: string
  prompt: string
  updatedAt: string
}

interface PromptHistoryProps {
  onSelectPrompt: (prompt: string) => void
}

export function PromptHistory({ onSelectPrompt }: PromptHistoryProps) {
  const [prompts, setPrompts] = useState<PromptHistoryItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const loadPrompts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/prompts?limit=10')
      if (response.ok) {
        const data = await response.json()
        setPrompts(data.prompts)
      }
    } catch (error) {
      console.error('Failed to load prompt history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && prompts.length === 0) {
      loadPrompts()
    }
  }, [isOpen])

  if (prompts.length === 0 && !isOpen) return null

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Recent prompts
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-96 bg-white border border-neutral-200 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-neutral-500">Loading...</div>
          ) : prompts.length === 0 ? (
            <div className="p-4 text-center text-sm text-neutral-500">No prompt history yet</div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {prompts.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectPrompt(item.prompt)
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-neutral-50 transition-colors"
                >
                  <p className="text-sm text-neutral-900 line-clamp-2">{item.prompt}</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
