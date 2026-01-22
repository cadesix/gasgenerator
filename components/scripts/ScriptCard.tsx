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

  return (
    <Link href={`/scripts/${script.id}`}>
      <Card className="hover:border-neutral-900 transition-colors cursor-pointer h-full">
        <div className="mb-3">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-neutral-900 flex-1">
              {script.title}
            </h3>
            {script.brief ? (
              <Badge variant="success">Has Brief</Badge>
            ) : (
              <Badge variant="default">No Brief</Badge>
            )}
          </div>
          <div className="flex gap-2 mb-3">
            <Badge variant="default">{script.project.name}</Badge>
            {script.format && (
              <Badge variant="success">{script.format.name}</Badge>
            )}
          </div>
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

        <div className="mt-4 pt-4 border-t border-neutral-200 flex items-center justify-between">
          <p className="text-xs text-neutral-500">
            Saved {new Date(script.savedAt).toLocaleDateString()}
          </p>
          {!script.brief && (
            <button
              onClick={handleCreateBrief}
              disabled={isCreatingBrief}
              className="text-sm text-neutral-900 hover:text-neutral-600 disabled:opacity-50"
            >
              {isCreatingBrief ? 'Creating...' : 'Create Brief'}
            </button>
          )}
        </div>
      </Card>
    </Link>
  )
}
