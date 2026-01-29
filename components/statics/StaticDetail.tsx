'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { DetailPageLayout } from '@/components/layout/DetailPageLayout'

interface StaticDetailProps {
  static: {
    id: string
    title: string
    prompt: string | null
    referenceImages: string
    generatedImage: string | null
    createdAt: Date
    project: {
      id: string
      name: string
      icon: string | null
    }
  }
}

export function StaticDetail({ static: static_ }: StaticDetailProps) {
  const router = useRouter()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const referenceImages = JSON.parse(static_.referenceImages) as string[]

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/statics/${static_.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete static')

      router.push('/statics')
      router.refresh()
    } catch (error) {
      console.error('Error deleting static:', error)
      alert('Failed to delete static. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUseAsReference = () => {
    // Navigate to statics page - could pass params to pre-fill form
    router.push('/statics')
  }

  const handleDownload = () => {
    if (static_.generatedImage) {
      const link = document.createElement('a')
      link.href = static_.generatedImage
      link.download = `${static_.title}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <>
      <DetailPageLayout
        title={static_.title}
        projectName={static_.project.name}
        actions={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={handleUseAsReference}>
              Use as Reference
            </Button>
            <Button variant="ghost" onClick={handleDownload}>
              Download
            </Button>
            <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
              Delete
            </Button>
          </div>
        }
        footer={
          <div className="text-sm text-neutral-500">
            Created on {new Date(static_.createdAt).toLocaleDateString()} at{' '}
            {new Date(static_.createdAt).toLocaleTimeString()}
          </div>
        }
      >
        {/* Generated Image */}
        {static_.generatedImage && (
          <Card>
            <div className="bg-neutral-50 rounded-lg p-4 flex items-center justify-center">
              <img
                src={static_.generatedImage}
                alt={static_.title}
                className="max-w-full h-auto rounded shadow-lg"
              />
            </div>
          </Card>
        )}

        {/* Prompt */}
        {static_.prompt && (
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Prompt</h2>
            <p className="text-sm text-neutral-900 whitespace-pre-wrap">
              {static_.prompt}
            </p>
          </Card>
        )}

        {/* Reference Images */}
        {referenceImages.length > 0 && (
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Reference Images
            </h2>
            <div className="flex flex-wrap gap-4">
              {referenceImages.map((imagePath, index) => (
                <img
                  key={index}
                  src={imagePath}
                  alt={`Reference ${index + 1}`}
                  className="w-32 h-32 object-cover rounded border border-neutral-200"
                />
              ))}
            </div>
          </Card>
        )}
      </DetailPageLayout>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Static"
      >
        <p className="text-neutral-600 mb-6">
          Are you sure you want to delete this static? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
            Delete Static
          </Button>
        </div>
      </Modal>
    </>
  )
}
