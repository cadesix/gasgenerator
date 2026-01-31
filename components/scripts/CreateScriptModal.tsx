'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'

interface Project {
  id: string
  name: string
  icon?: string | null
}

interface Format {
  id: string
  name: string
  sections: string
  isGlobal: boolean
  projectId: string | null
}

interface CreateScriptModalProps {
  isOpen: boolean
  onClose: () => void
  projects: Project[]
  formats: Format[]
}

export function CreateScriptModal({
  isOpen,
  onClose,
  projects,
  formats,
}: CreateScriptModalProps) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [selectedFormatId, setSelectedFormatId] = useState('')
  const [content, setContent] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  // Filter formats based on selected project
  const availableFormats = selectedProjectId
    ? formats.filter(
        (format) => format.isGlobal || format.projectId === selectedProjectId
      )
    : []

  // Get sections from selected format
  const sections =
    selectedFormatId && availableFormats.length > 0
      ? JSON.parse(
          availableFormats.find((f) => f.id === selectedFormatId)?.sections || '[]'
        )
      : []

  // Initialize content when format changes
  useEffect(() => {
    if (sections.length > 0) {
      const initialContent: Record<string, string> = {}
      sections.forEach((section: string) => {
        initialContent[section] = ''
      })
      setContent(initialContent)
    }
  }, [selectedFormatId])

  const handleSave = async () => {
    if (!title.trim() || !selectedProjectId) {
      alert('Please enter a title and select a project')
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch('/api/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: JSON.stringify(content),
          projectId: selectedProjectId,
          formatId: selectedFormatId || null,
        }),
      })

      if (!response.ok) throw new Error('Failed to create script')

      const script = await response.json()
      router.push(`/scripts/${script.id}`)
      router.refresh()
    } catch (error) {
      console.error('Error creating script:', error)
      alert('Failed to create script. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    setTitle('')
    setSelectedProjectId('')
    setSelectedFormatId('')
    setContent({})
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Script" maxWidth="lg">
      <div className="space-y-4">
        {/* Title */}
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter script title"
        />

        {/* Project Selection */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Project
          </label>
          <div className="flex flex-wrap gap-2">
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => {
                  setSelectedProjectId(project.id)
                  setSelectedFormatId('') // Reset format when project changes
                }}
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
            ))}
          </div>
        </div>

        {/* Format Selection */}
        {selectedProjectId && availableFormats.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Format (Optional)
            </label>
            <select
              value={selectedFormatId}
              onChange={(e) => setSelectedFormatId(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 bg-white text-neutral-900 rounded-lg focus:outline-none text-sm"
            >
              <option value="">No specific format</option>
              {availableFormats.map((format) => (
                <option key={format.id} value={format.id}>
                  {format.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Content Sections */}
        {sections.length > 0 && (
          <div className="space-y-3">
            {sections.map((section: string) => (
              <Textarea
                key={section}
                label={section.charAt(0).toUpperCase() + section.slice(1)}
                value={content[section] || ''}
                onChange={(e) =>
                  setContent((prev) => ({ ...prev, [section]: e.target.value }))
                }
                placeholder={`Enter ${section}...`}
                rows={4}
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} isLoading={isSaving}>
            Create Script
          </Button>
        </div>
      </div>
    </Modal>
  )
}
