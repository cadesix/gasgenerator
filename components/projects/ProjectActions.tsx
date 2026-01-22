'use client'

import { useRouter } from 'next/navigation'

interface ProjectActionsProps {
  projectId: string
}

export function ProjectActions({ projectId }: ProjectActionsProps) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      router.push('/projects')
      router.refresh()
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project. Please try again.')
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-neutral-900 hover:text-neutral-600"
    >
      Delete
    </button>
  )
}
