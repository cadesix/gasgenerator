'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ScriptFormat } from '@prisma/client'

interface FormatFormProps {
  projects: Array<{ id: string; name: string }>
  initialData?: ScriptFormat
}

export function FormatForm({ projects, initialData }: FormatFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Parse initial data if editing
  const initialSections = initialData?.sections
    ? (JSON.parse(initialData.sections) as string[])
    : ['hook', 'body']

  const initialExamples = initialData?.examples
    ? (JSON.parse(initialData.examples) as string[])
    : []

  const initialReferenceVideos = initialData?.referenceVideos
    ? (JSON.parse(initialData.referenceVideos) as string[])
    : []

  const initialFootageLinks = initialData?.footageLinks
    ? (JSON.parse(initialData.footageLinks) as string[])
    : []

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    structure: initialData?.structure || '',
    visualDescription: initialData?.visualDescription || '',
    isGlobal: initialData ? String(initialData.isGlobal) : 'true',
    projectId: initialData?.projectId || '',
    notes: initialData?.notes || '',
  })

  const [sections, setSections] = useState<string[]>(initialSections)
  const [examples, setExamples] = useState<string[]>(initialExamples)
  const [referenceVideos, setReferenceVideos] = useState<string[]>(initialReferenceVideos)
  const [footageLinks, setFootageLinks] = useState<string[]>(initialFootageLinks)

  const isEditing = !!initialData

  const handleSectionChange = (index: number, value: string) => {
    const newSections = [...sections]
    newSections[index] = value
    setSections(newSections)
  }

  const addSection = () => {
    setSections([...sections, ''])
  }

  const removeSection = (index: number) => {
    if (sections.length > 1) {
      setSections(sections.filter((_, i) => i !== index))
    }
  }

  const handleExampleChange = (index: number, value: string) => {
    const newExamples = [...examples]
    newExamples[index] = value
    setExamples(newExamples)
  }

  const addExample = () => {
    setExamples([...examples, ''])
  }

  const removeExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index))
  }

  const handleReferenceVideoChange = (index: number, value: string) => {
    const newVideos = [...referenceVideos]
    newVideos[index] = value
    setReferenceVideos(newVideos)
  }

  const addReferenceVideo = () => {
    setReferenceVideos([...referenceVideos, ''])
  }

  const removeReferenceVideo = (index: number) => {
    setReferenceVideos(referenceVideos.filter((_, i) => i !== index))
  }

  const handleFootageLinkChange = (index: number, value: string) => {
    const newLinks = [...footageLinks]
    newLinks[index] = value
    setFootageLinks(newLinks)
  }

  const addFootageLink = () => {
    setFootageLinks([...footageLinks, ''])
  }

  const removeFootageLink = (index: number) => {
    setFootageLinks(footageLinks.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const sectionsArray = sections
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      if (sectionsArray.length === 0) {
        alert('Please add at least one section')
        setIsLoading(false)
        return
      }

      const examplesArray = examples
        .map((ex) => ex.trim())
        .filter((ex) => ex.length > 0)

      const referenceVideosArray = referenceVideos
        .map((v) => v.trim())
        .filter((v) => v.length > 0)

      const footageLinksArray = footageLinks
        .map((l) => l.trim())
        .filter((l) => l.length > 0)

      const payload = {
        name: formData.name,
        structure: formData.structure,
        visualDescription: formData.visualDescription,
        isGlobal: formData.isGlobal === 'true',
        projectId: formData.isGlobal === 'false' ? formData.projectId : null,
        sections: JSON.stringify(sectionsArray),
        examples: JSON.stringify(examplesArray),
        referenceVideos: JSON.stringify(referenceVideosArray),
        footageLinks: JSON.stringify(footageLinksArray),
        notes: formData.notes.trim() || null,
      }

      const url = isEditing ? `/api/formats/${initialData.id}` : '/api/formats'
      const method = isEditing ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'create'} format`)

      router.push('/formats')
      router.refresh()
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} format:`, error)
      alert(`Failed to ${isEditing ? 'update' : 'create'} format. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <div className="space-y-6">
          <Input
            label="Format Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Textarea
            label="Structure"
            required
            rows={3}
            value={formData.structure}
            onChange={(e) => setFormData({ ...formData, structure: e.target.value })}
          />

          <Textarea
            label="Visual Description"
            required
            rows={3}
            value={formData.visualDescription}
            onChange={(e) =>
              setFormData({ ...formData, visualDescription: e.target.value })
            }
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Script Sections
            </label>
            <div className="space-y-3">
              {sections.map((section, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-neutral-500">Section {index + 1}</span>
                    {sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSection(index)}
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
                    required
                    className="w-full px-3 py-2 border border-neutral-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 text-sm"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addSection}
                className="text-sm text-neutral-900 hover:text-neutral-600"
              >
                + Add Section
              </button>
            </div>
          </div>

          <Select
            label="Availability"
            value={formData.isGlobal}
            onChange={(e) =>
              setFormData({ ...formData, isGlobal: e.target.value, projectId: '' })
            }
          >
            <option value="true">Global (available for all apps)</option>
            <option value="false">App-specific</option>
          </Select>

          {formData.isGlobal === 'false' && (
            <Select
              label="App"
              required
              value={formData.projectId}
              onChange={(e) =>
                setFormData({ ...formData, projectId: e.target.value })
              }
            >
              <option value="">Select an app</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </Select>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Example Scripts
            </label>
            <div className="space-y-3">
              {examples.map((example, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-neutral-500">Example {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeExample(index)}
                      className="text-sm text-neutral-600 hover:text-neutral-900"
                    >
                      Remove
                    </button>
                  </div>
                  <textarea
                    value={example}
                    onChange={(e) => handleExampleChange(index, e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 text-sm"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addExample}
                className="text-sm text-neutral-900 hover:text-neutral-600"
              >
                + Add Example
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Reference Videos
            </label>
            <div className="space-y-3">
              {referenceVideos.map((video, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-neutral-500">Video {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeReferenceVideo(index)}
                      className="text-sm text-neutral-600 hover:text-neutral-900"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="url"
                    value={video}
                    onChange={(e) => handleReferenceVideoChange(index, e.target.value)}
                    placeholder="https://"
                    className="w-full px-3 py-2 border border-neutral-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 text-sm"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addReferenceVideo}
                className="text-sm text-neutral-900 hover:text-neutral-600"
              >
                + Add Reference Video
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Footage
            </label>
            <div className="space-y-3">
              {footageLinks.map((link, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-neutral-500">Link {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeFootageLink(index)}
                      className="text-sm text-neutral-600 hover:text-neutral-900"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => handleFootageLinkChange(index, e.target.value)}
                    placeholder="https://"
                    className="w-full px-3 py-2 border border-neutral-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 text-sm"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addFootageLink}
                className="text-sm text-neutral-900 hover:text-neutral-600"
              >
                + Add Footage Link
              </button>
            </div>
          </div>

          <Textarea
            label="Notes"
            rows={4}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />

          <div className="flex gap-3">
            <Button type="submit" isLoading={isLoading}>
              {isEditing ? 'Update Format' : 'Create Format'}
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
