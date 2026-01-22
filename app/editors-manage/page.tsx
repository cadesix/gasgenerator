'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'

interface Editor {
  id: string
  name: string
  _count?: {
    briefs: number
  }
}

export default function EditorsManagePage() {
  const router = useRouter()
  const [editors, setEditors] = useState<Editor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEditor, setEditingEditor] = useState<Editor | null>(null)
  const [formData, setFormData] = useState({ name: '' })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchEditors()
  }, [])

  const fetchEditors = async () => {
    try {
      const response = await fetch('/api/editors')
      if (!response.ok) throw new Error('Failed to fetch editors')
      const data = await response.json()
      setEditors(data)
    } catch (error) {
      console.error('Error fetching editors:', error)
      alert('Failed to load editors')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (editor?: Editor) => {
    if (editor) {
      setEditingEditor(editor)
      setFormData({ name: editor.name })
    } else {
      setEditingEditor(null)
      setFormData({ name: '' })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingEditor(null)
    setFormData({ name: '' })
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a name')
      return
    }

    setIsSaving(true)

    try {
      const url = editingEditor ? `/api/editors/${editingEditor.id}` : '/api/editors'
      const method = editingEditor ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
        }),
      })

      if (!response.ok) throw new Error('Failed to save editor')

      await fetchEditors()
      handleCloseModal()
    } catch (error) {
      console.error('Error saving editor:', error)
      alert('Failed to save editor. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }


  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-neutral-600">Loading editors...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Editors</h1>
            <p className="mt-2 text-neutral-600">
              Manage editors who can be assigned to briefs
            </p>
          </div>
          <Button onClick={() => handleOpenModal()}>Add Editor</Button>
        </div>

        {editors.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                No editors yet
              </h3>
              <p className="text-neutral-600 mb-6">
                Add your first editor to get started
              </p>
              <Button onClick={() => handleOpenModal()}>Add Editor</Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {editors.map((editor) => (
              <Card key={editor.id}>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {editor.name}
                      </h3>
                    </div>
                  </div>

                  {editor._count && (
                    <div className="text-sm text-neutral-500 pt-3 border-t border-neutral-200">
                      {editor._count.briefs} brief{editor._count.briefs !== 1 ? 's' : ''} assigned
                    </div>
                  )}

                  <div className="pt-3 border-t border-neutral-200">
                    <button
                      onClick={() => handleOpenModal(editor)}
                      className="text-sm text-neutral-900 hover:text-neutral-600"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEditor ? 'Edit Editor' : 'Add Editor'}
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter editor name"
          />
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleSave} isLoading={isSaving}>
              {editingEditor ? 'Update' : 'Add'} Editor
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
