'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface ProjectDetailProps {
  project: {
    id: string
    name: string
    description: string
    targetAudience: string
    examples: string
  }
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const router = useRouter()
  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [description, setDescription] = useState(project.description)
  const [targetAudience, setTargetAudience] = useState(project.targetAudience)
  const [isSaving, setIsSaving] = useState(false)

  const [examples, setExamples] = useState<string[]>(JSON.parse(project.examples) as string[])
  const [newExample, setNewExample] = useState('')
  const [isAddingExample, setIsAddingExample] = useState(false)

  const handleSaveInfo = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: description.trim(),
          targetAudience: targetAudience.trim(),
        }),
      })

      if (!response.ok) throw new Error('Failed to update project')

      setIsEditingInfo(false)
      router.refresh()
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Failed to update project. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddExample = async () => {
    if (!newExample.trim()) return

    setIsAddingExample(true)
    try {
      const updatedExamples = [...examples, newExample.trim()]

      const response = await fetch(`/api/projects/${project.id}`, {
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

      const response = await fetch(`/api/projects/${project.id}`, {
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

  return (
    <>
      <Card className="mb-8">
        {!isEditingInfo ? (
          <>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-neutral-900">App Info</h2>
              <button
                onClick={() => setIsEditingInfo(true)}
                className="text-sm text-neutral-900 hover:text-neutral-600"
              >
                Edit
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-neutral-500 mb-1">Description</h3>
                <p className="text-neutral-900">{description}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-500 mb-1">Target Audience</h3>
                <p className="text-neutral-900">{targetAudience}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-neutral-900">App Info</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="block w-full px-3 py-2 border border-neutral-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="block w-full px-3 py-2 border border-neutral-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 text-sm"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setDescription(project.description)
                    setTargetAudience(project.targetAudience)
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

      <Card>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">Example Scripts</h2>
        </div>

        <div className="space-y-4">
          {examples.map((example, idx) => (
            <div key={idx} className="flex gap-2">
              <div className="flex-1 p-4 bg-neutral-50 text-sm text-neutral-700">
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
