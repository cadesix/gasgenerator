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

  // Parse initial examples if editing
  const initialExamples = initialData?.examples
    ? (JSON.parse(initialData.examples) as string[]).join('\n---\n')
    : ''

  // Parse initial sections if editing
  const initialSections = initialData?.sections
    ? (JSON.parse(initialData.sections) as string[])
    : ['hook', 'body']

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    structure: initialData?.structure || '',
    visualDescription: initialData?.visualDescription || '',
    isGlobal: initialData ? String(initialData.isGlobal) : 'true',
    projectId: initialData?.projectId || '',
    examples: initialExamples,
  })

  const [sections, setSections] = useState<string[]>(initialSections)

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const examplesArray = formData.examples
        .split('---')
        .map((ex: string) => ex.trim())
        .filter((ex: string) => ex.length > 0)

      const sectionsArray = sections
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      if (sectionsArray.length === 0) {
        alert('Please add at least one section')
        setIsLoading(false)
        return
      }

      const payload = {
        name: formData.name,
        structure: formData.structure,
        visualDescription: formData.visualDescription,
        isGlobal: formData.isGlobal === 'true',
        projectId: formData.isGlobal === 'false' ? formData.projectId : null,
        examples: JSON.stringify(examplesArray),
        sections: JSON.stringify(sectionsArray),
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
            placeholder="e.g., UGC Hook + Body"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Textarea
            label="Structure"
            placeholder="e.g., Personal hook (3s) → Problem → Solution → CTA"
            helperText="Describe the flow and components of this format"
            required
            rows={3}
            value={formData.structure}
            onChange={(e) => setFormData({ ...formData, structure: e.target.value })}
          />

          <Textarea
            label="Visual Description"
            placeholder="e.g., Person speaking to camera in casual setting, cut between locations"
            helperText="Describe visual elements to help create an editor brief"
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
            <p className="text-xs text-neutral-500 mb-3">
              Define the sections that scripts in this format will have (e.g., hook, body, cta)
            </p>
            <div className="space-y-2">
              {sections.map((section, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => handleSectionChange(index, e.target.value)}
                    placeholder={`Section ${index + 1} (e.g., ${index === 0 ? 'hook' : index === 1 ? 'body' : 'cta'})`}
                    required
                    className="flex-1 px-3 py-2 border border-neutral-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 text-sm"
                  />
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      className="px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900"
                    >
                      Remove
                    </button>
                  )}
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

          <Textarea
            label="Example Scripts (Optional)"
            placeholder='Hook: "Example hook text here" Body: "Example body text here"&#10;---&#10;Hook: "Another example hook" Body: "Another example body"'
            helperText="Paste example scripts in this format, separated by --- on new lines"
            rows={6}
            value={formData.examples}
            onChange={(e) => setFormData({ ...formData, examples: e.target.value })}
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
