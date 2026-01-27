'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OverflowMenu, OverflowMenuItem } from '@/components/ui/OverflowMenu'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface FormatOverflowMenuProps {
  formatId: string
  onEdit: () => void
}

export function FormatOverflowMenu({ formatId, onEdit }: FormatOverflowMenuProps) {
  const router = useRouter()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/formats/${formatId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete format')

      router.push('/formats')
      router.refresh()
    } catch (error) {
      console.error('Error deleting format:', error)
      alert('Failed to delete format. Please try again.')
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
    }
  }

  return (
    <>
      <OverflowMenu>
        <OverflowMenuItem onClick={onEdit}>
          Edit
        </OverflowMenuItem>
        <OverflowMenuItem onClick={() => setIsDeleteModalOpen(true)} variant="danger">
          Delete
        </OverflowMenuItem>
      </OverflowMenu>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Format"
      >
        <p className="text-neutral-600 mb-6">
          Are you sure you want to delete this format? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
            Delete Format
          </Button>
        </div>
      </Modal>
    </>
  )
}
