'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ScriptOverflowMenu } from '@/components/scripts/ScriptOverflowMenu'
import { EditableScriptContent } from '@/components/scripts/EditableScriptContent'
import { ScriptDetailActions } from '@/components/scripts/ScriptDetailActions'
import { ScriptNotes } from '@/components/scripts/ScriptNotes'
import { ScriptVideoLink } from '@/components/scripts/ScriptVideoLink'
import { AssignScriptButton } from '@/components/scripts/AssignScriptButton'
import { DetailPageLayout } from '@/components/layout/DetailPageLayout'

interface ScriptDetailContentProps {
  script: {
    id: string
    title: string
    content: string
    savedAt: Date
    editorId: string | null
    status: string
    notes: string | null
    videoLink: string | null
    generationPrompt: string | null
    project: {
      name: string
    }
    format?: {
      name: string
      structure: string
      visualDescription: string
      referenceVideos: string
      footageLinks: string
    } | null
    editor?: {
      id: string
      name: string
    } | null
  }
}

export function ScriptDetailContent({ script }: ScriptDetailContentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isPromptExpanded, setIsPromptExpanded] = useState(false)
  const content = JSON.parse(script.content) as Record<string, string>
  const sections = Object.keys(content)

  // Parse reference videos and footage
  const referenceVideos = script.format
    ? (JSON.parse(script.format.referenceVideos) as string[])
    : []
  const footageLinks = script.format
    ? (JSON.parse(script.format.footageLinks) as string[])
    : []

  return (
    <DetailPageLayout
      title={script.title}
      projectName={script.project.name}
      formatName={script.format?.name}
      additionalBadges={
        script.editor && (
          <Badge variant="default">Editor: {script.editor.name}</Badge>
        )
      }
      overflowMenu={
        <ScriptOverflowMenu
          scriptId={script.id}
          onEdit={() => setIsEditing(true)}
        />
      }
      actions={
        script.status !== 'unassigned' ? (
          <ScriptDetailActions
            scriptId={script.id}
            currentEditorId={script.editorId}
            currentEditor={script.editor}
            currentStatus={script.status}
          />
        ) : (
          <AssignScriptButton scriptId={script.id} />
        )
      }
      footer={
        <div className="text-sm text-neutral-500">
          Saved on {new Date(script.savedAt).toLocaleDateString()} at{' '}
          {new Date(script.savedAt).toLocaleTimeString()}
        </div>
      }
    >
      {/* Script Content */}
      <Card>
        <EditableScriptContent
          scriptId={script.id}
          initialContent={content}
          externalEditMode={isEditing}
          onEditModeChange={setIsEditing}
        />
      </Card>

      {/* Reference Videos */}
      {referenceVideos.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Reference Videos
          </h2>
          <div className="space-y-2">
            {referenceVideos.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
                >
                  {url}
                </a>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Footage Links */}
      {footageLinks.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Footage
          </h2>
          <div className="space-y-2">
            {footageLinks.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
                >
                  {url}
                </a>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Notes - only show if script is assigned */}
      {script.status !== 'unassigned' && (
        <ScriptNotes scriptId={script.id} initialNotes={script.notes} />
      )}

      {/* Video Link - only show if script is assigned */}
      {script.status !== 'unassigned' && (
        <ScriptVideoLink scriptId={script.id} initialVideoLink={script.videoLink} />
      )}

      {/* Format Details */}
      {script.format && (
        <Card>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Format Details
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-neutral-500">Structure</p>
              <p className="text-sm text-neutral-900">{script.format.structure}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">
                Visual Description
              </p>
              <p className="text-sm text-neutral-900">
                {script.format.visualDescription}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Generation Prompt */}
      {script.generationPrompt && (
        <Card>
          <button
            onClick={() => setIsPromptExpanded(!isPromptExpanded)}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="text-base font-medium text-neutral-700">
              Generation Prompt
            </h3>
            <svg
              className={`w-4 h-4 text-neutral-400 transition-transform ${
                isPromptExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isPromptExpanded && (
            <div className="mt-3 pt-3 border-t border-neutral-200">
              <p className="text-sm text-neutral-900 whitespace-pre-wrap">
                {script.generationPrompt}
              </p>
            </div>
          )}
        </Card>
      )}
    </DetailPageLayout>
  )
}
