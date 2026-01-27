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
    icon: project?.icon || '',
  })

  const isEditing = !!project

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (limit to 1MB)
    if (file.size > 1024 * 1024) {
      alert('Icon file size must be less than 1MB')
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData({ ...formData, icon: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveIcon = () => {
    setFormData({ ...formData, icon: '' })
  }

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
          icon: formData.icon || null,
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

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Icon
            </label>
            <div className="flex items-center gap-4">
              {formData.icon && (
                <div className="relative">
                  <img
                    src={formData.icon}
                    alt="App icon"
                    className="w-16 h-16 rounded-lg object-cover border border-neutral-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveIcon}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-neutral-900 text-white rounded-full flex items-center justify-center hover:bg-neutral-700"
                  >
                    ×
                  </button>
                </div>
              )}
              <label className="cursor-pointer px-4 py-2 border border-neutral-300 bg-white text-neutral-900 rounded-lg text-sm hover:bg-neutral-50 transition-colors">
                {formData.icon ? 'Change Icon' : 'Upload Icon'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIconUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              Upload a square image (max 1MB). Recommended size: 256x256px
            </p>
          </div>

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
