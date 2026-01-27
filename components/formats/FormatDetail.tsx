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
    referenceVideos: string
    footageLinks: string
    notes: string | null
  }
  projects: Array<{ id: string; name: string }>
  externalEditMode?: boolean
  onEditModeChange?: (isEditing: boolean) => void
}

export function FormatDetail({ format, projects, externalEditMode, onEditModeChange }: FormatDetailProps) {
  const router = useRouter()
  const [isEditingInfo, setIsEditingInfo] = useState(false)

  const actualIsEditingInfo = externalEditMode !== undefined ? externalEditMode : isEditingInfo
  const [structure, setStructure] = useState(format.structure)
  const [visualDescription, setVisualDescription] = useState(format.visualDescription)
  const [scope, setScope] = useState(format.isGlobal ? 'global' : (format.projectId || 'global'))
  const [isSaving, setIsSaving] = useState(false)

  const [sections, setSections] = useState<string[]>(JSON.parse(format.sections) as string[])
  const [isEditingSections, setIsEditingSections] = useState(false)
  const [editingSections, setEditingSections] = useState<string[]>([])

  const [examples, setExamples] = useState<string[]>(JSON.parse(format.examples) as string[])
  const [newExample, setNewExample] = useState('')
  const [isAddingExample, setIsAddingExample] = useState(false)

  const [referenceVideos, setReferenceVideos] = useState<string[]>(JSON.parse(format.referenceVideos) as string[])
  const [newReferenceVideo, setNewReferenceVideo] = useState('')
  const [isAddingReferenceVideo, setIsAddingReferenceVideo] = useState(false)

  const [footageLinks, setFootageLinks] = useState<string[]>(JSON.parse(format.footageLinks) as string[])
  const [newFootageLink, setNewFootageLink] = useState('')
  const [isAddingFootageLink, setIsAddingFootageLink] = useState(false)

  const [notes, setNotes] = useState(format.notes || '')
  const [isEditingNotes, setIsEditingNotes] = useState(false)

  const handleSaveInfo = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/formats/${format.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          structure: structure.trim(),
          visualDescription: visualDescription.trim(),
          isGlobal: scope === 'global',
          projectId: scope === 'global' ? null : scope,
        }),
      })

      if (!response.ok) throw new Error('Failed to update format')

      if (onEditModeChange) {
        onEditModeChange(false)
      } else {
        setIsEditingInfo(false)
      }
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

  const handleAddReferenceVideo = async () => {
    if (!newReferenceVideo.trim()) return

    setIsAddingReferenceVideo(true)
    try {
      const updatedVideos = [...referenceVideos, newReferenceVideo.trim()]

      const response = await fetch(`/api/formats/${format.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceVideos: JSON.stringify(updatedVideos),
        }),
      })

      if (!response.ok) throw new Error('Failed to add reference video')

      setReferenceVideos(updatedVideos)
      setNewReferenceVideo('')
      router.refresh()
    } catch (error) {
      console.error('Error adding reference video:', error)
      alert('Failed to add reference video. Please try again.')
    } finally {
      setIsAddingReferenceVideo(false)
    }
  }

  const handleDeleteReferenceVideo = async (index: number) => {
    if (!confirm('Are you sure you want to delete this reference video?')) return

    try {
      const updatedVideos = referenceVideos.filter((_, i) => i !== index)

      const response = await fetch(`/api/formats/${format.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceVideos: JSON.stringify(updatedVideos),
        }),
      })

      if (!response.ok) throw new Error('Failed to delete reference video')

      setReferenceVideos(updatedVideos)
      router.refresh()
    } catch (error) {
      console.error('Error deleting reference video:', error)
      alert('Failed to delete reference video. Please try again.')
    }
  }

  const handleAddFootageLink = async () => {
    if (!newFootageLink.trim()) return

    setIsAddingFootageLink(true)
    try {
      const updatedLinks = [...footageLinks, newFootageLink.trim()]

      const response = await fetch(`/api/formats/${format.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          footageLinks: JSON.stringify(updatedLinks),
        }),
      })

      if (!response.ok) throw new Error('Failed to add footage link')

      setFootageLinks(updatedLinks)
      setNewFootageLink('')
      router.refresh()
    } catch (error) {
      console.error('Error adding footage link:', error)
      alert('Failed to add footage link. Please try again.')
    } finally {
      setIsAddingFootageLink(false)
    }
  }

  const handleDeleteFootageLink = async (index: number) => {
    if (!confirm('Are you sure you want to delete this footage link?')) return

    try {
      const updatedLinks = footageLinks.filter((_, i) => i !== index)

      const response = await fetch(`/api/formats/${format.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          footageLinks: JSON.stringify(updatedLinks),
        }),
      })

      if (!response.ok) throw new Error('Failed to delete footage link')

      setFootageLinks(updatedLinks)
      router.refresh()
    } catch (error) {
      console.error('Error deleting footage link:', error)
      alert('Failed to delete footage link. Please try again.')
    }
  }

  const handleSaveNotes = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/formats/${format.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: notes.trim() || null,
        }),
      })

      if (!response.ok) throw new Error('Failed to update notes')

      setIsEditingNotes(false)
      router.refresh()
    } catch (error) {
      console.error('Error updating notes:', error)
      alert('Failed to update notes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <Card className="mb-8">
        {!actualIsEditingInfo ? (
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
                  className="block w-full px-3 py-2 border border-neutral-300 bg-white text-neutral-900 focus:outline-none text-sm rounded-2xl"
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
                  className="block w-full px-3 py-2 border border-neutral-300 bg-white text-neutral-900 focus:outline-none text-sm rounded-2xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  App
                </label>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="block w-full px-3 py-2 border border-neutral-300 bg-white text-neutral-900 focus:outline-none text-sm rounded-2xl"
                >
                  <option value="global">Global (available for all apps)</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setStructure(format.structure)
                    setVisualDescription(format.visualDescription)
                    setScope(format.isGlobal ? 'global' : (format.projectId || 'global'))
                    if (onEditModeChange) {
                      onEditModeChange(false)
                    } else {
                      setIsEditingInfo(false)
                    }
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
            <div className="space-y-3">
              {editingSections.map((section, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-neutral-500">Section {index + 1}</span>
                    {editingSections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(index)}
                        className="text-sm text-neutral-600 hover:text-neutral-900"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => handleSectionChange(index, e.target.value)}
                    placeholder={`Section ${index + 1}`}
                    className="w-full px-3 py-2 border border-neutral-300 bg-white text-neutral-900 focus:outline-none text-sm rounded-lg"
                  />
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

      <Card className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">Example Scripts</h2>
        </div>

        <div className="space-y-4">
          {examples.map((example, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-neutral-500">Example {idx + 1}</span>
                <button
                  onClick={() => handleDeleteExample(idx)}
                  className="text-sm text-neutral-600 hover:text-neutral-900"
                >
                  Delete
                </button>
              </div>
              <div className="p-4 bg-neutral-50 text-sm text-neutral-700 whitespace-pre-wrap">
                {example}
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-neutral-200">
            <textarea
              value={newExample}
              onChange={(e) => setNewExample(e.target.value)}
              placeholder="Add a new example script..."
              rows={3}
              className="block w-full px-3 py-2 border border-neutral-300 bg-white text-neutral-900 focus:outline-none text-sm rounded-2xl mb-3"
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

      <Card className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">Reference Videos</h2>
        </div>

        <div className="space-y-4">
          {referenceVideos.length > 0 ? (
            referenceVideos.map((video, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-neutral-500">Video {idx + 1}</span>
                  <button
                    onClick={() => handleDeleteReferenceVideo(idx)}
                    className="text-sm text-neutral-600 hover:text-neutral-900"
                  >
                    Delete
                  </button>
                </div>
                <div className="p-3 bg-neutral-50 text-sm text-neutral-700">
                  <a
                    href={video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-900 hover:underline"
                  >
                    {video}
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-neutral-500">No reference videos added yet</p>
          )}

          <div className="pt-4 border-t border-neutral-200">
            <input
              type="url"
              value={newReferenceVideo}
              onChange={(e) => setNewReferenceVideo(e.target.value)}
              placeholder="https://"
              className="block w-full px-3 py-2 border border-neutral-300 bg-white text-neutral-900 focus:outline-none text-sm rounded-2xl mb-3"
            />
            <Button
              onClick={handleAddReferenceVideo}
              isLoading={isAddingReferenceVideo}
              disabled={!newReferenceVideo.trim()}
            >
              Add Reference Video
            </Button>
          </div>
        </div>
      </Card>

      <Card className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">Footage</h2>
        </div>

        <div className="space-y-4">
          {footageLinks.length > 0 ? (
            footageLinks.map((link, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-neutral-500">Link {idx + 1}</span>
                  <button
                    onClick={() => handleDeleteFootageLink(idx)}
                    className="text-sm text-neutral-600 hover:text-neutral-900"
                  >
                    Delete
                  </button>
                </div>
                <div className="p-3 bg-neutral-50 text-sm text-neutral-700">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-900 hover:underline"
                  >
                    {link}
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-neutral-500">No footage links added yet</p>
          )}

          <div className="pt-4 border-t border-neutral-200">
            <input
              type="url"
              value={newFootageLink}
              onChange={(e) => setNewFootageLink(e.target.value)}
              placeholder="https://"
              className="block w-full px-3 py-2 border border-neutral-300 bg-white text-neutral-900 focus:outline-none text-sm rounded-2xl mb-3"
            />
            <Button
              onClick={handleAddFootageLink}
              isLoading={isAddingFootageLink}
              disabled={!newFootageLink.trim()}
            >
              Add Footage Link
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">Notes</h2>
          {!isEditingNotes && (
            <button
              onClick={() => setIsEditingNotes(true)}
              className="text-sm text-neutral-900 hover:text-neutral-600"
            >
              Edit
            </button>
          )}
        </div>

        {!isEditingNotes ? (
          <div>
            {notes ? (
              <p className="text-neutral-900 whitespace-pre-wrap">{notes}</p>
            ) : (
              <p className="text-sm text-neutral-500">No notes added yet</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="block w-full px-3 py-2 border border-neutral-300 bg-white text-neutral-900 focus:outline-none text-sm rounded-2xl"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setNotes(format.notes || '')
                  setIsEditingNotes(false)
                }}
                className="text-sm text-neutral-600 hover:text-neutral-900"
                disabled={isSaving}
              >
                Cancel
              </button>
              <Button onClick={handleSaveNotes} isLoading={isSaving}>
                Save
              </Button>
            </div>
          </div>
        )}
      </Card>
    </>
  )
}
