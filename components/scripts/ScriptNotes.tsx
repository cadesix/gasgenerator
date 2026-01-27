'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface ScriptNotesProps {
  scriptId: string
  initialNotes: string | null
}

export function ScriptNotes({ scriptId, initialNotes }: ScriptNotesProps) {
  const router = useRouter()
  const [notes, setNotes] = useState(initialNotes || '')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/scripts/${scriptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: notes.trim() || null,
        }),
      })

      if (!response.ok) throw new Error('Failed to update notes')

      setIsEditing(false)
      router.refresh()
    } catch (error) {
      console.error('Error updating notes:', error)
      alert('Failed to update notes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-neutral-900">Notes</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-neutral-900 hover:text-neutral-600"
          >
            Edit
          </button>
        )}
      </div>

      {!isEditing ? (
        <div>
          {notes ? (
            <p className="text-sm text-neutral-700 whitespace-pre-wrap">{notes}</p>
          ) : (
            <p className="text-sm text-neutral-500">No notes added yet</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            placeholder="Add notes about this script..."
            className="block w-full px-3 py-2 border border-neutral-300 bg-white text-neutral-900 focus:outline-none text-sm rounded-2xl"
          />
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setNotes(initialNotes || '')
                setIsEditing(false)
              }}
              className="text-sm text-neutral-600 hover:text-neutral-900"
              disabled={isSaving}
            >
              Cancel
            </button>
            <Button onClick={handleSave} isLoading={isSaving}>
              Save
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
