'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Project } from '@prisma/client'

interface StaticGeneratorProps {
  projects: Project[]
  onGenerated: (result: {
    generatedImage: string
    referencePaths: string[]
    prompt: string
    projectId: string
  }) => void
}

export function StaticGenerator({ projects, onGenerated }: StaticGeneratorProps) {
  const router = useRouter()
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '')
  const [prompt, setPrompt] = useState('')
  const [referenceImages, setReferenceImages] = useState<File[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault()

    if (!selectedProjectId) {
      alert('Please select a project')
      return
    }

    setIsGenerating(true)

    try {
      const formData = new FormData()
      formData.append('projectId', selectedProjectId)
      formData.append('prompt', prompt)

      referenceImages.forEach((image) => {
        formData.append('referenceImages', image)
      })

      const response = await fetch('/api/statics/generate', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to generate static')

      const data = await response.json()
      onGenerated({
        generatedImage: data.generatedImage,
        referencePaths: data.referencePaths,
        prompt,
        projectId: selectedProjectId,
      })
    } catch (error) {
      console.error('Error generating static:', error)
      alert('Failed to generate static. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setReferenceImages((prev) => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setReferenceImages((prev) => prev.filter((_, i) => i !== index))
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
      setReferenceImages((prev) => [...prev, ...files])
    }
  }

  return (
    <form
      onSubmit={handleGenerate}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`space-y-4 relative ${
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

      {/* Project Selection */}
      <div className="flex flex-wrap gap-2">
        {projects.length === 0 ? (
          <p className="text-sm text-neutral-500">No projects available</p>
        ) : (
          projects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => setSelectedProjectId(project.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedProjectId === project.id
                  ? 'bg-[#F0F0F0] text-neutral-900 border border-[#ABABAB]'
                  : 'bg-[#F0F0F0] text-neutral-700 hover:bg-neutral-200 border border-transparent'
              }`}
            >
              {project.icon && (
                <img
                  src={project.icon}
                  alt={project.name}
                  className="w-4 h-4 rounded object-cover"
                />
              )}
              {project.name}
            </button>
          ))
        )}
      </div>

      {/* Prompt Input */}
      <textarea
        placeholder="Describe the static ad you want to create..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={6}
        className="block w-full px-4 py-3 border border-neutral-300 rounded-2xl focus:outline-none text-sm resize-none placeholder:text-[#A3A3A3]"
      />

      {/* Reference Images Preview */}
      {referenceImages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {referenceImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(image)}
                alt={`Reference ${index + 1}`}
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

      {/* Add Images Button */}
      <label className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-neutral-100 text-neutral-700 rounded-full hover:bg-neutral-200 cursor-pointer transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Reference Images
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="hidden"
        />
      </label>

      {/* Generate Button */}
      <button
        type="submit"
        disabled={!selectedProjectId || isGenerating}
        className="w-full py-3 bg-[#F0F0F0] border border-[#D2D2D2] rounded-full text-sm font-medium text-neutral-900 hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? 'Generating...' : 'Fire Generator'}
      </button>
    </form>
  )
}
