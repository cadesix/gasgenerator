'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CopyButton } from '@/components/scripts/CopyButton'

interface EditableScriptContentProps {
  scriptId: string
  initialContent: Record<string, string>
  externalEditMode?: boolean
  onEditModeChange?: (isEditing: boolean) => void
}

export function EditableScriptContent({
  scriptId,
  initialContent,
  externalEditMode,
  onEditModeChange
}: EditableScriptContentProps) {
  const router = useRouter()
  const [content, setContent] = useState(initialContent)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const actualIsEditing = externalEditMode !== undefined ? externalEditMode : isEditing

  const sections = Object.keys(content)
  const fullScriptText = sections.map((section) => content[section]).join('\n\n')

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const response = await fetch(`/api/scripts/${scriptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: JSON.stringify(content) }),
      })

      if (!response.ok) throw new Error('Failed to update script')

      if (onEditModeChange) {
        onEditModeChange(false)
      } else {
        setIsEditing(false)
      }
      router.refresh()
    } catch (error) {
      console.error('Error updating script:', error)
      alert('Failed to update script. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setContent(initialContent)
    if (onEditModeChange) {
      onEditModeChange(false)
    } else {
      setIsEditing(false)
    }
  }

  const handleEdit = () => {
    if (onEditModeChange) {
      onEditModeChange(true)
    } else {
      setIsEditing(true)
    }
  }

  return (
    <>
      {/* Edit/Save/Cancel buttons at top (only show if not using external control) */}
      {actualIsEditing && (
        <div className="flex items-center justify-end gap-2 mb-6">
          <button
            onClick={handleCancel}
            className="text-sm text-neutral-600 hover:text-neutral-900"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-neutral-900 text-white hover:bg-neutral-800 rounded"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}

      {/* Script sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section}>
            <h2 className="text-lg font-semibold text-neutral-900 uppercase mb-3">
              {section}
            </h2>
            {actualIsEditing ? (
              <textarea
                value={content[section]}
                onChange={(e) => setContent({ ...content, [section]: e.target.value })}
                className="w-full min-h-[200px] px-4 py-3 text-neutral-900 bg-white border border-neutral-300 rounded-2xl focus:outline-none whitespace-pre-wrap font-mono text-sm"
                disabled={isSaving}
              />
            ) : (
              <p className="text-neutral-900 whitespace-pre-wrap leading-relaxed">
                {content[section]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Copy button at bottom */}
      <div className="mt-8 pt-6 border-t border-neutral-200">
        <div className="flex items-center justify-between">
          <CopyButton
            text={fullScriptText}
            label="Copy Full Script"
          />
        </div>
      </div>
    </>
  )
}
