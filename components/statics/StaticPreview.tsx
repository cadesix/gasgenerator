'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface StaticPreviewProps {
  generatedImage: string
  prompt: string
  projectId: string
  referencePaths: string[]
  onIterate: () => void
}

export function StaticPreview({
  generatedImage,
  prompt,
  projectId,
  referencePaths,
  onIterate,
}: StaticPreviewProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const response = await fetch('/api/statics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          prompt,
          referenceImages: referencePaths,
          generatedImage,
        }),
      })

      if (!response.ok) throw new Error('Failed to save static')

      const static_ = await response.json()
      router.push(`/statics/${static_.id}`)
    } catch (error) {
      console.error('Error saving static:', error)
      alert('Failed to save static. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-900">Generated Static</h2>

        <div className="bg-neutral-50 rounded-lg p-4 flex items-center justify-center">
          <img
            src={generatedImage}
            alt="Generated static"
            className="max-w-full h-auto rounded shadow-lg"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onIterate}>
            Iterate
          </Button>
          <Button onClick={handleSave} isLoading={isSaving}>
            Save Static
          </Button>
        </div>
      </div>
    </Card>
  )
}
