'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CopyButton } from '@/components/scripts/CopyButton'

interface EditableScriptContentProps {
  scriptId: string
  initialContent: Record<string, string>
}

export function EditableScriptContent({ scriptId, initialContent }: EditableScriptContentProps) {
  const router = useRouter()
  const [content, setContent] = useState(initialContent)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const sections = Object.keys(content)
  const fullScriptText = sections.map((section) => content[section]).join('\n\n')

  const handleSave = async (section: string) => {
    setIsSaving(true)

    try {
      const response = await fetch(`/api/scripts/${scriptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: JSON.stringify(content) }),
      })

      if (!response.ok) throw new Error('Failed to update script')

      setEditingSection(null)
      router.refresh()
    } catch (error) {
      console.error('Error updating script:', error)
      alert('Failed to update script. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = (section: string) => {
    setContent(initialContent)
    setEditingSection(null)
  }

  return (
    <>
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={section}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-neutral-900 uppercase">
                {section}
              </h2>
              <div className="flex items-center gap-2">
                {editingSection === section ? (
                  <>
                    <button
                      onClick={() => handleCancel(section)}
                      className="text-sm text-neutral-600 hover:text-neutral-900"
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(section)}
                      className="text-sm text-neutral-900 hover:text-neutral-600 font-medium"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingSection(section)}
                      className="text-sm text-neutral-600 hover:text-neutral-900"
                    >
                      Edit
                    </button>
                    <CopyButton text={content[section]} label={`Copy ${section}`} />
                  </>
                )}
              </div>
            </div>
            {editingSection === section ? (
              <textarea
                value={content[section]}
                onChange={(e) => setContent({ ...content, [section]: e.target.value })}
                className="w-full min-h-[200px] px-4 py-3 text-neutral-900 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 whitespace-pre-wrap font-mono text-sm"
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
