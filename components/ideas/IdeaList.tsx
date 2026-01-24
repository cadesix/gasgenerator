'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Idea, Project } from '@prisma/client'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { IconButton } from '@/components/ui/IconButton'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface IdeaWithProject extends Idea {
  project: Project | null
}

interface IdeaListProps {
  ideas: IdeaWithProject[]
}

export function IdeaList({ ideas }: IdeaListProps) {
  const router = useRouter()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [ideaToDelete, setIdeaToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!ideaToDelete) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/ideas/${ideaToDelete}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete idea')

      router.refresh()
      setDeleteModalOpen(false)
      setIdeaToDelete(null)
    } catch (error) {
      console.error('Error deleting idea:', error)
      alert('Failed to delete idea. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (ideas.length === 0) {
    return (
      <Card>
        <p className="text-neutral-500 text-center py-8">
          No ideas yet
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {ideas.map((idea) => (
        <div key={idea.id} className="group">
          <Card padding="sm" className="transition-transform duration-200 ease-out group-hover:scale-[1.02] origin-center">
            <div className="transition-transform duration-200 ease-out group-hover:scale-[0.9804] origin-center">
            <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-neutral-900 whitespace-pre-wrap mb-2">
                {idea.content}
              </p>
              <div className="flex items-center gap-2">
                {idea.project && (
                  <Badge variant="default">{idea.project.name}</Badge>
                )}
                <span className="text-xs text-neutral-500">
                  {new Date(idea.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <IconButton
              variant="danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setIdeaToDelete(idea.id)
                setDeleteModalOpen(true)
              }}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </IconButton>
          </div>
          </div>
          </Card>
        </div>
      ))}

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setIdeaToDelete(null)
        }}
        title="Delete Idea"
      >
        <p className="text-neutral-600 mb-6">
          Are you sure you want to delete this idea? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="ghost"
            onClick={() => {
              setDeleteModalOpen(false)
              setIdeaToDelete(null)
            }}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
            Delete Idea
          </Button>
        </div>
      </Modal>
    </div>
  )
}
