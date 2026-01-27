'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'

interface ScriptsTableProps {
  scripts: {
    id: string
    title: string
    content: string
    savedAt: Date
    status: string | null
    editorId: string | null
    project: {
      name: string
      icon?: string | null
    }
    format: {
      name: string
    } | null
    editor: {
      id: string
      name: string
    } | null
  }[]
}

interface Editor {
  id: string
  name: string
}

export function ScriptsTable({ scripts }: ScriptsTableProps) {
  const router = useRouter()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [editors, setEditors] = useState<Editor[]>([])
  const [isLoadingEditors, setIsLoadingEditors] = useState(false)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchEditors()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openDropdownId) {
        setOpenDropdownId(null)
      }
    }

    if (openDropdownId) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [openDropdownId])

  const fetchEditors = async () => {
    setIsLoadingEditors(true)
    try {
      const response = await fetch('/api/editors')
      if (!response.ok) throw new Error('Failed to fetch editors')
      const data = await response.json()
      setEditors(data)
    } catch (error) {
      console.error('Error fetching editors:', error)
    } finally {
      setIsLoadingEditors(false)
    }
  }

  const handleRowClick = (scriptId: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(scriptId)) {
        newSet.delete(scriptId)
      } else {
        newSet.add(scriptId)
      }
      return newSet
    })
  }

  const handleAssignEditor = async (scriptId: string, editorId: string) => {
    setIsUpdating(scriptId)
    try {
      const response = await fetch(`/api/scripts/${scriptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          editorId,
          status: 'assigned'
        }),
      })

      if (!response.ok) throw new Error('Failed to assign editor')

      router.refresh()
      setOpenDropdownId(null)
    } catch (error) {
      console.error('Error assigning editor:', error)
      alert('Failed to assign editor. Please try again.')
    } finally {
      setIsUpdating(null)
    }
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
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
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider w-12">
              App
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Title
            </th>
            <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider w-48">
              Editor
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-200">
          {scripts.map((script) => {
            const content = JSON.parse(script.content) as Record<string, string>
            const sections = Object.keys(content)
            const isExpanded = expandedIds.has(script.id)

            return (
              <tr key={script.id}>
                <td colSpan={3} className="p-0">
                  <div className="cursor-pointer hover:bg-neutral-50 transition-colors">
                    <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-3 items-center">
                      {/* App Icon */}
                      <div onClick={() => handleRowClick(script.id)}>
                        {script.project.icon && (
                          <img
                            src={script.project.icon}
                            alt={script.project.name}
                            className="w-4 h-4 rounded object-cover"
                          />
                        )}
                      </div>

                      {/* Title */}
                      <div onClick={() => handleRowClick(script.id)}>
                        <span className="text-sm font-medium text-neutral-900">{script.title}</span>
                      </div>

                      {/* Editor Column */}
                      <div className="w-48 flex justify-end" onClick={(e) => e.stopPropagation()}>
                        {script.status && script.editor ? (
                          <div className="flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-full w-[118px]">
                            <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(script.status)}`} />
                            <span className="text-xs text-neutral-700 truncate">{script.editor.name}</span>
                          </div>
                        ) : (
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setOpenDropdownId(openDropdownId === script.id ? null : script.id)
                              }}
                              disabled={isUpdating === script.id}
                              className="w-6 h-6 rounded-full border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                            {openDropdownId === script.id && (
                              <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-50">
                                <div className="py-1">
                                  {isLoadingEditors ? (
                                    <div className="px-4 py-2 text-sm text-neutral-500">Loading...</div>
                                  ) : editors.length === 0 ? (
                                    <div className="px-4 py-2 text-sm text-neutral-500">No editors available</div>
                                  ) : (
                                    editors.map((editor) => (
                                      <button
                                        key={editor.id}
                                        onClick={() => handleAssignEditor(script.id, editor.id)}
                                        disabled={isUpdating === script.id}
                                        className="w-full text-left px-4 py-2 text-sm text-neutral-900 hover:bg-neutral-50 disabled:opacity-50"
                                      >
                                        {editor.name}
                                      </button>
                                    ))
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
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
          })}
        </tbody>
      </table>
    </div>
  )
}
