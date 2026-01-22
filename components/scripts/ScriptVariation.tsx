'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'

interface ScriptVariationProps {
  index: number
  content: Record<string, string>
  projectId: string
  formatId: string
  batchInstructions?: string
  onUpdate: (updates: Record<string, string>) => void
}

export function ScriptVariation({
  index,
  content,
  projectId,
  formatId,
  batchInstructions,
  onUpdate,
}: ScriptVariationProps) {
  const router = useRouter()
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [scriptTitle, setScriptTitle] = useState(`Script ${index + 1}`)
  const [isSaving, setIsSaving] = useState(false)
  const [showRepromptInput, setShowRepromptInput] = useState(false)
  const [repromptContext, setRepromptContext] = useState('')
  const [isReprompting, setIsReprompting] = useState(false)

  const sections = Object.keys(content)

  const handleReprompt = async () => {
    if (!repromptContext.trim()) {
      alert('Please enter some context for the reprompt')
      return
    }

    setIsReprompting(true)

    try {
      const response = await fetch('/api/reprompt-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          formatId,
          currentContent: content,
          batchInstructions,
          repromptContext: repromptContext.trim(),
        }),
      })

      if (!response.ok) throw new Error('Failed to reprompt script')

      const data = await response.json()
      onUpdate(data.content)
      setShowRepromptInput(false)
      setRepromptContext('')
    } catch (error) {
      console.error('Error reprompting script:', error)
      alert('Failed to reprompt script. Please try again.')
    } finally {
      setIsReprompting(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const response = await fetch('/api/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: scriptTitle,
          content: JSON.stringify(content),
          projectId,
          formatId,
        }),
      })

      if (!response.ok) throw new Error('Failed to save script')

      const script = await response.json()
      setIsSaveModalOpen(false)
      router.push(`/scripts/${script.id}`)
    } catch (error) {
      console.error('Error saving script:', error)
      alert('Failed to save script. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <Card className="h-full">
        <div className="flex flex-col h-full">
          <div className="flex-1 space-y-4">
            {sections.map((section) => (
              <div key={section}>
                <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
                  {section}
                </h4>
                <p className="text-base text-neutral-900 whitespace-pre-wrap">
                  {content[section]}
                </p>
              </div>
            ))}
          </div>

          {showRepromptInput && (
            <div className="pt-4 space-y-2">
              <input
                type="text"
                value={repromptContext}
                onChange={(e) => setRepromptContext(e.target.value)}
                placeholder="Add context for regeneration..."
                className="w-full px-3 py-2 text-sm border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleReprompt()
                  }
                }}
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowRepromptInput(false)
                    setRepromptContext('')
                  }}
                  className="text-sm text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReprompt}
                  disabled={isReprompting}
                  className="text-sm text-neutral-900 hover:text-neutral-600 disabled:opacity-50"
                >
                  {isReprompting ? 'Regenerating...' : 'Regenerate'}
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-end pt-4 mt-auto border-t border-neutral-200">
            <button
              onClick={() => setIsSaveModalOpen(true)}
              className="text-sm text-neutral-900 hover:text-neutral-600"
            >
              Save
            </button>
            <button
              onClick={() => setShowRepromptInput(!showRepromptInput)}
              className="text-sm text-neutral-900 hover:text-neutral-600"
              disabled={isReprompting}
            >
              Reprompt
            </button>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title="Save Script"
      >
        <div className="space-y-4">
          <Input
            label="Script Title"
            value={scriptTitle}
            onChange={(e) => setScriptTitle(e.target.value)}
            placeholder="Enter a title for this script"
          />
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setIsSaveModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} isLoading={isSaving}>
              Save Script
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
