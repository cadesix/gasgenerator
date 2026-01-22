'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface FormatDetailProps {
  format: {
    id: string
    name: string
    structure: string
    visualDescription: string
    isGlobal: boolean
    projectId: string | null
    examples: string
    sections: string
  }
  projects: Array<{ id: string; name: string }>
}

export function FormatDetail({ format, projects }: FormatDetailProps) {
  const router = useRouter()
  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [structure, setStructure] = useState(format.structure)
  const [visualDescription, setVisualDescription] = useState(format.visualDescription)
  const [isGlobal, setIsGlobal] = useState(format.isGlobal)
  const [projectId, setProjectId] = useState(format.projectId || '')
  const [isSaving, setIsSaving] = useState(false)

  const [sections, setSections] = useState<string[]>(JSON.parse(format.sections) as string[])
  const [isEditingSections, setIsEditingSections] = useState(false)
  const [editingSections, setEditingSections] = useState<string[]>([])

  const [examples, setExamples] = useState<string[]>(JSON.parse(format.examples) as string[])
  const [newExample, setNewExample] = useState('')
  const [isAddingExample, setIsAddingExample] = useState(false)

  const handleSaveInfo = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/formats/${format.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          structure: structure.trim(),
          visualDescription: visualDescription.trim(),
          isGlobal,
          projectId: isGlobal ? null : projectId || null,
        }),
      })

      if (!response.ok) throw new Error('Failed to update format')

      setIsEditingInfo(false)
      router.refresh()
    } catch (error) {
      console.error('Error updating format:', error)
      alert('Failed to update format. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleStartEditSections = () => {
    setEditingSections([...sections])
    setIsEditingSections(true)
  }

  const handleSaveSections = async () => {
    const validSections = editingSections.map((s) => s.trim()).filter((s) => s.length > 0)

    if (validSections.length === 0) {
      alert('Please add at least one section')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/formats/${format.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections: JSON.stringify(validSections),
        }),
      })

      if (!response.ok) throw new Error('Failed to update sections')

      setSections(validSections)
      setIsEditingSections(false)
      router.refresh()
    } catch (error) {
      console.error('Error updating sections:', error)
      alert('Failed to update sections. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddSection = () => {
    setEditingSections([...editingSections, ''])
  }

  const handleRemoveSection = (index: number) => {
    if (editingSections.length > 1) {
      setEditingSections(editingSections.filter((_, i) => i !== index))
    }
  }

  const handleSectionChange = (index: number, value: string) => {
    const newSections = [...editingSections]
    newSections[index] = value
    setEditingSections(newSections)
  }

  const handleAddExample = async () => {
    if (!newExample.trim()) return

    setIsAddingExample(true)
    try {
      const updatedExamples = [...examples, newExample.trim()]

      const response = await fetch(`/api/formats/${format.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examples: JSON.stringify(updatedExamples),
        }),
      })

      if (!response.ok) throw new Error('Failed to add example')

      setExamples(updatedExamples)
      setNewExample('')
      router.refresh()
    } catch (error) {
      console.error('Error adding example:', error)
      alert('Failed to add example. Please try again.')
    } finally {
      setIsAddingExample(false)
    }
  }

  const handleDeleteExample = async (index: number) => {
    if (!confirm('Are you sure you want to delete this example?')) return

    try {
      const updatedExamples = examples.filter((_, i) => i !== index)

      const response = await fetch(`/api/formats/${format.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examples: JSON.stringify(updatedExamples),
        }),
      })

      if (!response.ok) throw new Error('Failed to delete example')

      setExamples(updatedExamples)
      router.refresh()
    } catch (error) {
      console.error('Error deleting example:', error)
      alert('Failed to delete example. Please try again.')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this format? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/formats/${format.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete format')

      router.push('/formats')
      router.refresh()
    } catch (error) {
      console.error('Error deleting format:', error)
      alert('Failed to delete format. Please try again.')
    }
  }

  return (
    <>
      <Card className="mb-8">
        {!isEditingInfo ? (
          <>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-neutral-900">Format Info</h2>
                {format.isGlobal ? (
                  <Badge variant="default">Global</Badge>
                ) : (
                  <Badge variant="success">
                    {projects.find((p) => p.id === format.projectId)?.name || 'App-specific'}
                  </Badge>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsEditingInfo(true)}
                  className="text-sm text-neutral-900 hover:text-neutral-600"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-sm text-neutral-900 hover:text-neutral-600"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-neutral-500 mb-1">Structure</h3>
                <p className="text-neutral-900">{structure}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-500 mb-1">Visual Description</h3>
                <p className="text-neutral-900">{visualDescription}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-neutral-900">Format Info</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Structure
                </label>
                <textarea
                  value={structure}
                  onChange={(e) => setStructure(e.target.value)}
                  rows={3}
                  className="block w-full px-3 py-2 border border-neutral-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Visual Description
                </label>
                <textarea
                  value={visualDescription}
                  onChange={(e) => setVisualDescription(e.target.value)}
                  rows={3}
                  className="block w-full px-3 py-2 border border-neutral-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Availability
                </label>
                <select
                  value={isGlobal ? 'true' : 'false'}
                  onChange={(e) => {
                    setIsGlobal(e.target.value === 'true')
                    if (e.target.value === 'true') setProjectId('')
                  }}
                  className="block w-full px-3 py-2 border border-neutral-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 text-sm"
                >
                  <option value="true">Global (available for all apps)</option>
                  <option value="false">App-specific</option>
                </select>
              </div>
              {!isGlobal && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    App
                  </label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="block w-full px-3 py-2 border border-neutral-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 text-sm"
                  >
                    <option value="">Select an app</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setStructure(format.structure)
                    setVisualDescription(format.visualDescription)
                    setIsGlobal(format.isGlobal)
                    setProjectId(format.projectId || '')
                    setIsEditingInfo(false)
                  }}
                  className="text-sm text-neutral-600 hover:text-neutral-900"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <Button onClick={handleSaveInfo} isLoading={isSaving}>
                  Save
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      <Card className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">Script Sections</h2>
          {!isEditingSections && (
            <button
              onClick={handleStartEditSections}
              className="text-sm text-neutral-900 hover:text-neutral-600"
            >
              Edit
            </button>
          )}
        </div>

        {!isEditingSections ? (
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <Badge key={section} variant="default">
                {section}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">
              Define the sections that scripts in this format will have
            </p>
            <div className="space-y-2">
              {editingSections.map((section, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => handleSectionChange(index, e.target.value)}
                    placeholder={`Section ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-neutral-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 text-sm"
                  />
                  {editingSections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(index)}
                      className="px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSection}
                className="text-sm text-neutral-900 hover:text-neutral-600"
              >
                + Add Section
              </button>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t border-neutral-200">
              <button
                onClick={() => {
                  setIsEditingSections(false)
                  setEditingSections([])
                }}
                className="text-sm text-neutral-600 hover:text-neutral-900"
                disabled={isSaving}
              >
                Cancel
              </button>
              <Button onClick={handleSaveSections} isLoading={isSaving}>
                Save
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">Example Scripts</h2>
        </div>

        <div className="space-y-4">
          {examples.map((example, idx) => (
            <div key={idx} className="flex gap-2">
              <div className="flex-1 p-4 bg-neutral-50 text-sm text-neutral-700 whitespace-pre-wrap">
                {example}
              </div>
              <button
                onClick={() => handleDeleteExample(idx)}
                className="text-sm text-neutral-600 hover:text-neutral-900"
              >
                Delete
              </button>
            </div>
          ))}

          <div className="pt-4 border-t border-neutral-200">
            <textarea
              value={newExample}
              onChange={(e) => setNewExample(e.target.value)}
              placeholder="Add a new example script..."
              rows={3}
              className="block w-full px-3 py-2 border border-neutral-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 text-sm mb-3"
            />
            <Button
              onClick={handleAddExample}
              isLoading={isAddingExample}
              disabled={!newExample.trim()}
            >
              Add Example
            </Button>
          </div>
        </div>
      </Card>
    </>
  )
}
