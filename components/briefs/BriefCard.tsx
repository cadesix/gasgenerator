'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface BriefCardProps {
  brief: {
    id: string
    editorId: string | null
    editor: {
      id: string
      name: string
    } | null
    status: string
    shareId: string
    script: {
      id: string
      title: string
      content: string
      project: {
        name: string
      }
      format: {
        name: string
      } | null
    }
  }
}

export function BriefCard({ brief }: BriefCardProps) {
  const router = useRouter()
  const [status, setStatus] = useState(brief.status)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(brief.script.title)
  const [isSaving, setIsSaving] = useState(false)

  // Parse content to get first section
  const content = JSON.parse(brief.script.content) as Record<string, string>
  const firstSection = Object.keys(content)[0]

  const handleUpdate = async (field: string, value: string) => {
    setIsUpdating(true)

    try {
      const response = await fetch(`/api/briefs/${brief.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })

      if (!response.ok) throw new Error('Failed to update brief')

      router.refresh()
    } catch (error) {
      console.error('Error updating brief:', error)
      alert('Failed to update brief. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const copyBriefLink = () => {
    const url = `${window.location.origin}/briefs/${brief.id}`
    navigator.clipboard.writeText(url)
    alert('Brief link copied to clipboard!')
  }

  const handleSaveTitle = async () => {
    if (!title.trim() || title === brief.script.title) {
      setIsEditingTitle(false)
      setTitle(brief.script.title)
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(`/api/scripts/${brief.script.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      })

      if (!response.ok) throw new Error('Failed to update title')

      router.refresh()
      setIsEditingTitle(false)
    } catch (error) {
      console.error('Error updating title:', error)
      alert('Failed to update title. Please try again.')
      setTitle(brief.script.title)
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'Assigned'
      case 'in_progress':
        return 'In Progress'
      case 'completed':
        return 'Completed'
      default:
        return status
    }
  }

  return (
    <Link href={`/briefs/${brief.id}`} className="group">
      <Card className="cursor-pointer transition-transform duration-200 ease-out group-hover:scale-[1.02] origin-center">
        <div className="transition-transform duration-200 ease-out group-hover:scale-[0.9804] origin-center">
          <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-[10px] text-neutral-500 mb-1">{brief.script.project.name}</p>
              {isEditingTitle ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle()
                    if (e.key === 'Escape') {
                      setTitle(brief.script.title)
                      setIsEditingTitle(false)
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  disabled={isSaving}
                  autoFocus
                  className="text-lg font-semibold text-neutral-900 w-full border-none outline-none bg-transparent"
                />
              ) : (
                <h3
                  className="text-lg font-semibold text-neutral-900 cursor-text"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsEditingTitle(true)
                  }}
                >
                  {brief.script.title}
                </h3>
              )}
              {brief.script.format && (
                <div className="flex gap-2 mt-2">
                  <Badge variant="success">{brief.script.format.name}</Badge>
                </div>
              )}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                copyBriefLink()
              }}
              className="text-neutral-500 hover:text-neutral-900 ml-2"
              title="Copy brief link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>

          {firstSection && (
            <div>
              <p className="text-xs font-medium text-neutral-500 uppercase mb-1">{firstSection}:</p>
              <p className="text-sm text-neutral-700 line-clamp-2">{content[firstSection]}</p>
            </div>
          )}

          <div className="pt-4 border-t border-neutral-200">
            <div onClick={(e) => e.stopPropagation()}>
              <label className="block text-xs font-medium text-neutral-500 mb-1">
                Status
              </label>
              <div className="relative">
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${getStatusColor(status)}`} />
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value)
                    handleUpdate('status', e.target.value)
                  }}
                  className="w-full pl-8 pr-4 py-2 text-sm border border-neutral-300 rounded-full focus:outline-none appearance-none bg-white cursor-pointer"
                  disabled={isUpdating}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        </div>
      </Card>
    </Link>
  )
}
