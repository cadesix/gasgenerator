'use client'

import { useState, forwardRef } from 'react'
import { useRouter } from 'next/navigation'

interface ScriptRowProps {
  script: {
    id: string
    title: string
    content: string
    status: string
    editorId: string | null
    project: {
      name: string
      icon?: string | null
    }
    editor?: {
      id: string
      name: string
    } | null
  }
  isExpanded: boolean
  onToggleExpand: () => void
  showEditor?: boolean
  showDragHandle?: boolean
  dragHandleProps?: any
  style?: React.CSSProperties
}

export const ScriptRow = forwardRef<HTMLTableRowElement, ScriptRowProps>(
  function ScriptRow(
    {
      script,
      isExpanded,
      onToggleExpand,
      showEditor = true,
      showDragHandle = false,
      dragHandleProps,
      style,
    },
    ref
  ) {
    const router = useRouter()
    const [isHovered, setIsHovered] = useState(false)

  const content = JSON.parse(script.content) as Record<string, string>
  const sections = Object.keys(content)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unassigned':
        return 'bg-neutral-400'
      case 'assigned':
        return 'bg-neutral-400'
      case 'in_progress':
        return 'bg-yellow-500'
      case 'completed':
        return 'bg-green-500'
      default:
        return 'bg-neutral-400'
    }
  }

  return (
    <tr
      ref={ref}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <td colSpan={showEditor ? 3 : 3} className="p-0">
        <div className="cursor-pointer hover:bg-neutral-50 transition-colors">
          <div className={`flex items-center gap-4 px-4 py-3`}>
            {/* App Icon */}
            <div onClick={onToggleExpand} className="w-4 flex-shrink-0">
              {script.project.icon && (
                <img
                  src={script.project.icon}
                  alt={script.project.name}
                  className="w-4 h-4 rounded object-cover"
                />
              )}
            </div>

            {/* Status (when no editor column) - between icon and title */}
            {!showEditor && (
              <div onClick={onToggleExpand} className="flex-shrink-0">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(script.status)}`} />
              </div>
            )}

            {/* Title */}
            <div onClick={onToggleExpand} className="flex-1 min-w-0">
              <span className="text-sm font-medium text-neutral-900">{script.title}</span>
            </div>

            {/* Editor Column (when shown) */}
            {showEditor && (
              <div className="w-48 flex justify-end flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                {script.status !== 'unassigned' && script.editor ? (
                  <div className="flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-full w-[118px]">
                    <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(script.status)}`} />
                    <span className="text-xs text-neutral-700 truncate">{script.editor.name}</span>
                  </div>
                ) : (
                  <div className="w-6 h-6"></div>
                )}
              </div>
            )}

            {/* Drag Handle */}
            {showDragHandle && (
              <div
                {...dragHandleProps}
                className={`w-12 flex justify-center flex-shrink-0 cursor-grab active:cursor-grabbing transition-opacity ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <svg
                  className="w-4 h-4 text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="px-4 pb-4 pt-2 bg-neutral-50 border-t border-neutral-200">
              <div className="space-y-3">
                {sections.map((section) => (
                  <div key={section}>
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                      {section}:
                    </p>
                    <p className="text-xs text-neutral-700 leading-relaxed">
                      {content[section]}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/scripts/${script.id}`)
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  )
})
