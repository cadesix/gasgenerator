'use client'

import { useState } from 'react'
import { CreateScriptModal } from './CreateScriptModal'

interface Project {
  id: string
  name: string
  icon?: string | null
}

interface Format {
  id: string
  name: string
  sections: string
  isGlobal: boolean
  projectId: string | null
}

interface ScriptsPageHeaderProps {
  projects: Project[]
  formats: Format[]
}

export function ScriptsPageHeader({ projects, formats }: ScriptsPageHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-2">
        <h1 className="text-[20px] font-bold text-neutral-900">Scripts</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center w-6 h-6 rounded-full border border-neutral-300 hover:border-neutral-900 transition-colors"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 1V11M1 6H11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <CreateScriptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projects={projects}
        formats={formats}
      />
    </>
  )
}
