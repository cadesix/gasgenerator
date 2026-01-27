'use client'

import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { FormatOverflowMenu } from '@/components/formats/FormatOverflowMenu'
import { FormatDetail } from '@/components/formats/FormatDetail'

interface FormatDetailContentProps {
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
}

export function FormatDetailContent({ format, projects }: FormatDetailContentProps) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <PageContainer
      title={format.name}
      overflowMenu={
        <FormatOverflowMenu
          formatId={format.id}
          onEdit={() => setIsEditing(true)}
        />
      }
    >
      <FormatDetail
        format={format}
        projects={projects}
        externalEditMode={isEditing}
        onEditModeChange={setIsEditing}
      />
    </PageContainer>
  )
}
