'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

interface Editor {
  id: string
  name: string
}

interface AssignScriptButtonProps {
  scriptId: string
}

export function AssignScriptButton({ scriptId }: AssignScriptButtonProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editors, setEditors] = useState<Editor[]>([])
  const [selectedEditorId, setSelectedEditorId] = useState<string>('')
  const [isAssigning, setIsAssigning] = useState(false)
  const [isLoadingEditors, setIsLoadingEditors] = useState(false)

  useEffect(() => {
    if (isModalOpen) {
      fetchEditors()
    }
  }, [isModalOpen])

  const fetchEditors = async () => {
    setIsLoadingEditors(true)
    try {
      const response = await fetch('/api/editors')
      if (!response.ok) throw new Error('Failed to fetch editors')
      const data = await response.json()
      setEditors(data)
    } catch (error) {
      console.error('Error fetching editors:', error)
      alert('Failed to load editors')
    } finally {
      setIsLoadingEditors(false)
    }
  }

  const handleAssign = async () => {
    setIsAssigning(true)

    try {
      const response = await fetch(`/api/scripts/${scriptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          editorId: selectedEditorId || null,
          status: 'assigned',
        }),
      })

      if (!response.ok) throw new Error('Failed to assign script')

      router.refresh()
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error assigning script:', error)
      alert('Failed to assign script. Please try again.')
    } finally {
      setIsAssigning(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        Assign Script
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assign Script"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Assign Editor (optional)
            </label>
            {isLoadingEditors ? (
              <p className="text-sm text-neutral-600">Loading editors...</p>
            ) : (
              <select
                value={selectedEditorId}
                onChange={(e) => setSelectedEditorId(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 bg-white text-neutral-900 rounded-lg focus:outline-none"
              >
                <option value="">Unassigned</option>
                {editors.map((editor) => (
                  <option key={editor.id} value={editor.id}>
                    {editor.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              isLoading={isAssigning}
              disabled={isLoadingEditors}
            >
              Assign Script
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
