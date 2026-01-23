'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Project } from '@prisma/client'

interface ProjectFormProps {
  project?: Project
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    targetAudience: project?.targetAudience || '',
  })

  const isEditing = !!project

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert('Please enter a name')
      return
    }

    setIsLoading(true)

    try {
      const url = isEditing ? `/api/projects/${project.id}` : '/api/projects'
      const method = isEditing ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          targetAudience: formData.targetAudience.trim(),
          ...(isEditing ? {} : { examples: '[]' }),
        }),
      })

      if (!response.ok) throw new Error('Failed to save project')

      router.push('/settings')
      router.refresh()
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Failed to save project. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <div className="space-y-6">
          <Input
            label="App Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Fitness Tracker"
          />

          <Textarea
            label="Description"
            required
            rows={16}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what your app does"
          />

          <Textarea
            label="Target Audience"
            required
            rows={3}
            value={formData.targetAudience}
            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
            placeholder="Who is this app for?"
          />

          <div className="flex gap-3">
            <Button type="submit" isLoading={isLoading}>
              {isEditing ? 'Update App' : 'Create App'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </form>
  )
}
