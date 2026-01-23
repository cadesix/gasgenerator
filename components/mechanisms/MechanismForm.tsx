'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Mechanism } from '@prisma/client'

interface MechanismFormProps {
  mechanism?: Mechanism
}

export function MechanismForm({ mechanism }: MechanismFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: mechanism?.title || '',
    content: mechanism?.content || '',
  })

  const isEditing = !!mechanism

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in all fields')
      return
    }

    setIsLoading(true)

    try {
      const url = isEditing ? `/api/mechanisms/${mechanism.id}` : '/api/mechanisms'
      const method = isEditing ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content.trim(),
        }),
      })

      if (!response.ok) throw new Error('Failed to save mechanism')

      router.push('/settings')
      router.refresh()
    } catch (error) {
      console.error('Error saving mechanism:', error)
      alert('Failed to save mechanism. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <div className="space-y-6">
          <Input
            label="Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Problem-Agitate-Solution"
          />

          <Textarea
            label="Content"
            required
            rows={24}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Paste the full text of the copywriting principle or mechanism here..."
          />

          <div className="flex gap-3">
            <Button type="submit" isLoading={isLoading}>
              {isEditing ? 'Update Mechanism' : 'Create Mechanism'}
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
