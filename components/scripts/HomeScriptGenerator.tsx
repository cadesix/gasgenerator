'use client'

import { useState, useMemo, useEffect } from 'react'
import { Project, ScriptFormat, Mechanism } from '@prisma/client'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ScriptVariation } from '@/components/scripts/ScriptVariation'

interface HomeScriptGeneratorProps {
  projects: Project[]
  formats: ScriptFormat[]
  mechanisms: Mechanism[]
}

interface GeneratedScript {
  [sectionName: string]: string
}

interface PersistedState {
  scripts: GeneratedScript[]
  selectedProjectId: string
  selectedFormatId: string
  batchInstructions: string
  selectedMechanismIds: string[]
}

const STORAGE_KEY = 'gas-generated-scripts'

export function HomeScriptGenerator({ projects, formats, mechanisms }: HomeScriptGeneratorProps) {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '')
  const [selectedFormatId, setSelectedFormatId] = useState('')
  const [batchInstructions, setBatchInstructions] = useState('')
  const [selectedMechanismIds, setSelectedMechanismIds] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [scripts, setScripts] = useState<GeneratedScript[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load persisted state on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const persisted: PersistedState = JSON.parse(stored)
        setScripts(persisted.scripts)
        setSelectedProjectId(persisted.selectedProjectId || projects[0]?.id || '')
        setSelectedFormatId(persisted.selectedFormatId || '')
        setBatchInstructions(persisted.batchInstructions || '')
        setSelectedMechanismIds(persisted.selectedMechanismIds || [])
      }
    } catch (error) {
      console.error('Failed to load persisted scripts:', error)
    }
    setIsLoaded(true)
  }, [projects])

  // Persist state whenever it changes
  useEffect(() => {
    if (!isLoaded) return

    try {
      const state: PersistedState = {
        scripts,
        selectedProjectId,
        selectedFormatId,
        batchInstructions,
        selectedMechanismIds,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.error('Failed to persist scripts:', error)
    }
  }, [scripts, selectedProjectId, selectedFormatId, batchInstructions, selectedMechanismIds, isLoaded])

  // Filter formats based on selected project (global + project-specific)
  const availableFormats = useMemo(() => {
    if (!selectedProjectId) return []
    return formats.filter(
      (format) => format.isGlobal || format.projectId === selectedProjectId
    )
  }, [selectedProjectId, formats])

  const handleGenerate = async () => {
    if (!selectedProjectId) {
      setError('Please select a project')
      return
    }

    setIsGenerating(true)
    setError(null)
    // Clear previous scripts when generating new batch
    setScripts([])

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProjectId,
          formatId: selectedFormatId || undefined,
          batchInstructions: batchInstructions.trim() || undefined,
          mechanismIds: selectedMechanismIds.length > 0 ? selectedMechanismIds : undefined,
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

  const toggleMechanism = (mechanismId: string) => {
    setSelectedMechanismIds(prev =>
      prev.includes(mechanismId)
        ? prev.filter(id => id !== mechanismId)
        : [...prev, mechanismId]
    )
  }

  const handleUpdateScript = (index: number, updates: Partial<GeneratedScript>) => {
    setScripts((prev) =>
      prev.map((script, i) => (i === index ? { ...script, ...updates } : script))
    )
  }

  return (
    <div className="space-y-8">
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {projects.length === 0 ? (
                <p className="text-sm text-neutral-500">No projects available</p>
              ) : (
                projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setSelectedProjectId(project.id)
                      setSelectedFormatId('') // Reset format when project changes
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedProjectId === project.id
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {project.name}
                  </button>
                ))
              )}
            </div>

            <select
              value={selectedFormatId}
              onChange={(e) => setSelectedFormatId(e.target.value)}
              disabled={!selectedProjectId || availableFormats.length === 0}
              className="px-3 py-2 border border-neutral-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 text-sm disabled:bg-neutral-50 disabled:cursor-not-allowed"
            >
              <option value="">No specific format</option>
              {availableFormats.map((format) => (
                <option key={format.id} value={format.id}>
                  {format.name} {format.isGlobal ? '(Global)' : '(Project-specific)'}
                </option>
              ))}
            </select>

            <Button
              onClick={handleGenerate}
              isLoading={isGenerating}
              disabled={!selectedProjectId || projects.length === 0}
            >
              Generate Scripts
            </Button>
          </div>

          {mechanisms.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Mechanisms (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {mechanisms.map((mechanism) => (
                  <button
                    key={mechanism.id}
                    type="button"
                    onClick={() => toggleMechanism(mechanism.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedMechanismIds.includes(mechanism.id)
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {mechanism.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Batch Instructions (Optional)
            </label>
            <textarea
              placeholder="e.g., Focus on price point, emphasize free trial, target mobile users"
              value={batchInstructions}
              onChange={(e) => setBatchInstructions(e.target.value)}
              rows={2}
              className="block w-full px-3 py-2 border border-neutral-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 text-sm resize-none"
            />
          </div>

          {error && (
            <div className="bg-neutral-100 border border-neutral-300 p-4">
              <p className="text-sm text-neutral-900">{error}</p>
            </div>
          )}
        </div>
      </Card>

      {scripts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            Generated Variations
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {scripts.map((script, index) => (
              <ScriptVariation
                key={index}
                index={index}
                content={script}
                projectId={selectedProjectId}
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
