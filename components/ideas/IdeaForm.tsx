'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface IdeaFormProps {
  projects: Array<{ id: string; name: string }>
}

export function IdeaForm({ projects }: IdeaFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [content, setContent] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          type: 'ad_concept',
          projectId: selectedProjectId || null,
        }),
      })

      if (!response.ok) throw new Error('Failed to save idea')

      // Reset form
      setContent('')
      setSelectedProjectId('')
      router.refresh()
    } catch (error) {
      console.error('Error saving idea:', error)
      alert('Failed to save idea. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedProjectId('')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedProjectId === ''
              ? 'bg-neutral-900 text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          All Apps
        </button>
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => setSelectedProjectId(project.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedProjectId === project.id
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {project.name}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add an idea..."
          className="flex-1 px-4 py-2 border border-neutral-300 bg-white text-neutral-900 focus:outline-none rounded-lg"
          required
        />
        <Button type="submit" isLoading={isSubmitting}>
          Add
        </Button>
      </form>
    </div>
  )
}
