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
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('content', content.trim())
      formData.append('type', 'ad_concept')
      formData.append('projectId', selectedProjectId || '')

      selectedImages.forEach((image) => {
        formData.append('images', image)
      })

      const response = await fetch('/api/ideas', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to save idea')

      // Reset form
      setContent('')
      setSelectedProjectId('')
      setSelectedImages([])
      router.refresh()
    } catch (error) {
      console.error('Error saving idea:', error)
      alert('Failed to save idea. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedImages((prev) => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    )
    if (files.length > 0) {
      setSelectedImages((prev) => [...prev, ...files])
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

      <form
        onSubmit={handleSubmit}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`space-y-3 relative ${
          isDragging ? 'ring-2 ring-neutral-900 ring-offset-2 rounded-lg' : ''
        }`}
      >
        {isDragging && (
          <div className="absolute inset-0 bg-neutral-900 bg-opacity-5 rounded-lg flex items-center justify-center pointer-events-none z-10">
            <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-neutral-300">
              <p className="text-sm font-medium text-neutral-900">Drop images here</p>
            </div>
          </div>
        )}
        <div className="flex gap-2">
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
        </div>

        {selectedImages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded border border-neutral-300"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-neutral-100 text-neutral-700 rounded-full hover:bg-neutral-200 cursor-pointer transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Images
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />
        </label>
      </form>
    </div>
  )
}
