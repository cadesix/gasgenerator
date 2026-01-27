'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

interface ScriptVideoLinkProps {
  scriptId: string
  initialVideoLink?: string | null
}

export function ScriptVideoLink({ scriptId, initialVideoLink }: ScriptVideoLinkProps) {
  const router = useRouter()
  const [videoLink, setVideoLink] = useState(initialVideoLink || '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!videoLink.trim()) {
      alert('Please enter a video link')
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(`/api/scripts/${scriptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoLink: videoLink.trim(),
          status: 'completed'
        }),
      })

      if (!response.ok) throw new Error('Failed to save video link')

      router.refresh()
    } catch (error) {
      console.error('Error saving video link:', error)
      alert('Failed to save video link. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-neutral-900 mb-4">
        Completed Video Link
      </h2>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="url"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          placeholder="https://..."
          disabled={isSaving}
          className="flex-1"
        />
        <button
          type="submit"
          disabled={isSaving || !videoLink.trim()}
          className="px-4 py-2 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {isSaving ? 'Saving...' : initialVideoLink ? 'Update' : 'Submit'}
        </button>
      </form>
    </Card>
  )
}
