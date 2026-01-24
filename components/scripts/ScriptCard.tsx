'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useState } from 'react'

interface ScriptCardProps {
  script: {
    id: string
    title: string
    content: string
    savedAt: Date
    project: {
      name: string
    }
    format: {
      name: string
    } | null
    brief: {
      id: string
      status: string
    } | null
  }
}

export function ScriptCard({ script }: ScriptCardProps) {
  const router = useRouter()
  const [isCreatingBrief, setIsCreatingBrief] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(script.title)
  const [isSaving, setIsSaving] = useState(false)

  // Parse content JSON to get sections
  const content = JSON.parse(script.content) as Record<string, string>
  const sections = Object.keys(content)

  const handleCreateBrief = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsCreatingBrief(true)

    try {
      const response = await fetch('/api/briefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptId: script.id }),
      })

      if (!response.ok) throw new Error('Failed to create brief')

      const brief = await response.json()
      router.push(`/briefs/${brief.id}`)
    } catch (error) {
      console.error('Error creating brief:', error)
      alert('Failed to create brief. Please try again.')
    } finally {
      setIsCreatingBrief(false)
    }
  }

  const handleSaveTitle = async () => {
    if (!title.trim() || title === script.title) {
      setIsEditingTitle(false)
      setTitle(script.title)
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(`/api/scripts/${script.id}`, {
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
      setTitle(script.title)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Link href={`/scripts/${script.id}`} className="group">
      <Card className="cursor-pointer h-full transition-transform duration-200 ease-out group-hover:scale-[1.02] origin-center">
        <div className="transition-transform duration-200 ease-out group-hover:scale-[0.9804] origin-center">
          <div className="mb-3">
          <p className="text-[10px] text-neutral-500 mb-1">{script.project.name}</p>
          <div className="flex items-start justify-between mb-2">
            {isEditingTitle ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle()
                  if (e.key === 'Escape') {
                    setTitle(script.title)
                    setIsEditingTitle(false)
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                disabled={isSaving}
                autoFocus
                className="text-lg font-semibold text-neutral-900 flex-1 border-none outline-none bg-transparent"
              />
            ) : (
              <h3
                className="text-lg font-semibold text-neutral-900 flex-1 cursor-text"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsEditingTitle(true)
                }}
              >
                {script.title}
              </h3>
            )}
            {script.brief ? (
              <Badge variant="success">Has Brief</Badge>
            ) : (
              <Badge variant="default">No Brief</Badge>
            )}
          </div>
          {script.format && (
            <div className="flex gap-2 mb-3">
              <Badge variant="success">{script.format.name}</Badge>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {sections.slice(0, 2).map((section, index) => (
            <div key={section}>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                {section}:
              </p>
              <p className={`text-sm ${index === 0 ? 'text-neutral-700' : 'text-neutral-600'} line-clamp-${index === 0 ? '2' : '3'}`}>
                {content[section]}
              </p>
            </div>
          ))}
        </div>

          <div className="mt-4 pt-4 border-t border-neutral-200">
            <p className="text-xs text-neutral-500">
              Saved {new Date(script.savedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
