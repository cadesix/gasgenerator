'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'

interface Mechanism {
  id: string
  title: string
  content: string
}

export default function MechanismsManagePage() {
  const router = useRouter()
  const [mechanisms, setMechanisms] = useState<Mechanism[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMechanism, setEditingMechanism] = useState<Mechanism | null>(null)
  const [formData, setFormData] = useState({ title: '', content: '' })
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchMechanisms()
  }, [])

  const fetchMechanisms = async () => {
    try {
      const response = await fetch('/api/mechanisms')
      if (!response.ok) throw new Error('Failed to fetch mechanisms')
      const data = await response.json()
      setMechanisms(data)
    } catch (error) {
      console.error('Error fetching mechanisms:', error)
      alert('Failed to load mechanisms')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (mechanism?: Mechanism) => {
    if (mechanism) {
      setEditingMechanism(mechanism)
      setFormData({ title: mechanism.title, content: mechanism.content })
    } else {
      setEditingMechanism(null)
      setFormData({ title: '', content: '' })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingMechanism(null)
    setFormData({ title: '', content: '' })
  }

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please enter both title and content')
      return
    }

    setIsSaving(true)

    try {
      const url = editingMechanism ? `/api/mechanisms/${editingMechanism.id}` : '/api/mechanisms'
      const method = editingMechanism ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content.trim(),
        }),
      })

      if (!response.ok) throw new Error('Failed to save mechanism')

      await fetchMechanisms()
      handleCloseModal()
    } catch (error) {
      console.error('Error saving mechanism:', error)
      alert('Failed to save mechanism. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mechanism?')) return

    setDeletingId(id)

    try {
      const response = await fetch(`/api/mechanisms/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete mechanism')

      await fetchMechanisms()
    } catch (error) {
      console.error('Error deleting mechanism:', error)
      alert('Failed to delete mechanism. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-neutral-600">Loading mechanisms...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Mechanisms</h1>
            <p className="mt-2 text-neutral-600">
              Manage copywriting principles and mechanisms to use as context when generating scripts
            </p>
          </div>
          <Button onClick={() => handleOpenModal()}>Add Mechanism</Button>
        </div>

        {mechanisms.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                No mechanisms yet
              </h3>
              <p className="text-neutral-600 mb-6">
                Add your first mechanism to get started
              </p>
              <Button onClick={() => handleOpenModal()}>Add Mechanism</Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {mechanisms.map((mechanism) => (
              <Card key={mechanism.id}>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {mechanism.title}
                    </h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleOpenModal(mechanism)}
                        className="text-sm text-neutral-900 hover:text-neutral-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(mechanism.id)}
                        disabled={deletingId === mechanism.id}
                        className="text-sm text-neutral-900 hover:text-neutral-600 disabled:opacity-50"
                      >
                        {deletingId === mechanism.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-700 whitespace-pre-wrap line-clamp-3">
                    {mechanism.content}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMechanism ? 'Edit Mechanism' : 'Add Mechanism'}
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Problem-Agitate-Solution"
          />
          <Textarea
            label="Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Paste the full text of the copywriting principle or mechanism here..."
            rows={12}
          />
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleSave} isLoading={isSaving}>
              {editingMechanism ? 'Update' : 'Add'} Mechanism
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
