'use client'

import { useState } from 'react'
import { Project, ScriptFormat } from '@prisma/client'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ScriptVariation } from '@/components/scripts/ScriptVariation'

interface ScriptGeneratorProps {
  project: Project
  formats: ScriptFormat[]
}

interface GeneratedScript {
  [sectionName: string]: string
}

export function ScriptGenerator({ project, formats }: ScriptGeneratorProps) {
  const [selectedFormatId, setSelectedFormatId] = useState(formats[0]?.id || '')
  const [batchInstructions, setBatchInstructions] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [scripts, setScripts] = useState<GeneratedScript[]>([])
  const [error, setError] = useState<string | null>(null)

  const selectedFormat = formats.find((f) => f.id === selectedFormatId)

  const handleGenerate = async () => {
    if (!selectedFormatId) {
      setError('Please select a format')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          formatId: selectedFormatId,
          batchInstructions: batchInstructions.trim() || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate scripts')
      }

      const data = await response.json()
      setScripts(data.scripts)
    } catch (err) {
      console.error('Error generating scripts:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate scripts')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUpdateScript = (index: number, updates: Partial<GeneratedScript>) => {
    setScripts((prev) =>
      prev.map((script, i) => (i === index ? { ...script, ...updates } : script))
    )
  }

  return (
    <div className="space-y-8">
      <Card>
        <div className="space-y-6">
          <Select
            label="Script Format"
            value={selectedFormatId}
            onChange={(e) => setSelectedFormatId(e.target.value)}
          >
            {formats.length === 0 ? (
              <option value="">No formats available</option>
            ) : (
              formats.map((format) => (
                <option key={format.id} value={format.id}>
                  {format.name} {format.isGlobal ? '(Global)' : '(Project-specific)'}
                </option>
              ))
            )}
          </Select>

          {selectedFormat && (
            <div className="bg-neutral-50 rounded-md p-4 space-y-2">
              <div>
                <span className="text-sm font-medium text-neutral-700">
                  Structure:
                </span>
                <p className="text-sm text-neutral-600 mt-1">
                  {selectedFormat.structure}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-neutral-700">
                  Visual Description:
                </span>
                <p className="text-sm text-neutral-600 mt-1">
                  {selectedFormat.visualDescription}
                </p>
              </div>
            </div>
          )}

          <Textarea
            label="Batch Instructions (Optional)"
            placeholder="e.g., Focus on price point, emphasize free trial, target mobile users"
            helperText="Add specific instructions for this batch of scripts"
            value={batchInstructions}
            onChange={(e) => setBatchInstructions(e.target.value)}
            rows={3}
          />

          {error && (
            <div className="bg-danger-50 border border-danger-200 rounded-md p-4">
              <p className="text-sm text-danger-700">{error}</p>
            </div>
          )}

          <Button
            onClick={handleGenerate}
            isLoading={isGenerating}
            disabled={!selectedFormatId || formats.length === 0}
            size="lg"
          >
            Generate 5 Scripts
          </Button>
        </div>
      </Card>

      {scripts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            Generated Variations
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {scripts.map((script, index) => (
              <ScriptVariation
                key={index}
                index={index}
                content={script}
                projectId={project.id}
                formatId={selectedFormatId}
                batchInstructions={batchInstructions}
                onUpdate={(updates) => handleUpdateScript(index, updates)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
