'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

interface Editor {
  id: string
  name: string
}

interface CreateBriefButtonProps {
  scriptId: string
}

export function CreateBriefButton({ scriptId }: CreateBriefButtonProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editors, setEditors] = useState<Editor[]>([])
  const [selectedEditorId, setSelectedEditorId] = useState<string>('')
  const [isCreating, setIsCreating] = useState(false)
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

  const handleCreateBrief = async () => {
    setIsCreating(true)

    try {
      const response = await fetch('/api/briefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptId,
          editorId: selectedEditorId || null,
        }),
      })

      if (!response.ok) throw new Error('Failed to create brief')

      const brief = await response.json()
      router.push(`/briefs/${brief.id}`)
    } catch (error) {
      console.error('Error creating brief:', error)
      alert('Failed to create brief. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        Create Brief
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Brief"
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
                className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
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
              onClick={handleCreateBrief}
              isLoading={isCreating}
              disabled={isLoadingEditors}
            >
              Create Brief
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
