'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface ProjectFormProps {
  initialData?: {
    id: string
    name: string
    description: string
    targetAudience: string
    examples: string
  }
  isEditing?: boolean
}

export function ProjectForm({ initialData, isEditing = false }: ProjectFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    targetAudience: initialData?.targetAudience || '',
  })
  const [examples, setExamples] = useState<string[]>(
    initialData ? JSON.parse(initialData.examples) : ['']
  )

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const filteredExamples = examples.filter(ex => ex.trim().length > 0)

      const payload = {
        ...formData,
        examples: JSON.stringify(filteredExamples),
      }

      const url = isEditing ? `/api/projects/${initialData?.id}` : '/api/projects'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to save project')

      const project = await response.json()
      router.push(`/projects/${project.id}`)
      router.refresh()
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Failed to save project. Please try again.')
    } finally {
      setIsLoading(false)
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

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <div className="space-y-6">
          <Input
            label="App Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Textarea
            label="Description"
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Textarea
            label="Target Audience"
            required
            rows={2}
            value={formData.targetAudience}
            onChange={(e) =>
              setFormData({ ...formData, targetAudience: e.target.value })
            }
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-neutral-700">
                Example Scripts (Optional)
              </label>
              <button
                type="button"
                onClick={addExample}
                className="text-sm text-neutral-900 hover:text-neutral-600"
              >
                + Add Example
              </button>
            </div>
            <div className="space-y-3">
              {examples.map((example, index) => (
                <div key={index} className="flex gap-2">
                  <textarea
                    value={example}
                    onChange={(e) => handleExampleChange(index, e.target.value)}
                    rows={3}
                    className="flex-1 px-3 py-2 border border-neutral-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 text-sm"
                  />
                  {examples.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExample(index)}
                      className="text-sm text-neutral-600 hover:text-neutral-900"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

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
