'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

interface DeleteScriptButtonProps {
  scriptId: string
}

export function DeleteScriptButton({ scriptId }: DeleteScriptButtonProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/scripts/${scriptId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete script')

      router.push('/scripts')
      router.refresh()
    } catch (error) {
      console.error('Error deleting script:', error)
      alert('Failed to delete script. Please try again.')
    } finally {
      setIsDeleting(false)
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <Button variant="danger" onClick={() => setIsModalOpen(true)}>
        Delete
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Delete Script"
      >
        <p className="text-neutral-600 mb-6">
          Are you sure you want to delete this script? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
            Delete Script
          </Button>
        </div>
      </Modal>
    </>
  )
}
