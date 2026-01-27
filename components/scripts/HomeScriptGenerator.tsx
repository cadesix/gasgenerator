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
      prev.map((script, i) => {
        if (i === index) {
          const updated: GeneratedScript = { ...script }
          Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined) {
              updated[key] = value
            }
          })
          return updated
        }
        return script
      })
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {/* Project chips and format selector */}
        <div className="flex items-center justify-between gap-4">
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                    selectedProjectId === project.id
                      ? 'bg-[#F0F0F0] text-neutral-900 border border-[#ABABAB]'
                      : 'bg-[#F0F0F0] text-neutral-700 hover:bg-neutral-200 border border-transparent'
                  }`}
                >
                  {project.icon && (
                    <img
                      src={project.icon}
                      alt={project.name}
                      className="w-4 h-4 rounded object-cover"
                    />
                  )}
                  {project.name}
                </button>
              ))
            )}
          </div>

          <select
            value={selectedFormatId}
            onChange={(e) => setSelectedFormatId(e.target.value)}
            disabled={!selectedProjectId || availableFormats.length === 0}
            className="w-48 px-3 py-2 border border-neutral-300 bg-white text-neutral-900 rounded-full focus:outline-none text-sm disabled:bg-neutral-50 disabled:cursor-not-allowed truncate"
          >
            <option value="">No specific format</option>
            {availableFormats.map((format) => (
              <option key={format.id} value={format.id}>
                {format.name}
              </option>
            ))}
          </select>
        </div>

        {/* Input field with mechanisms at bottom */}
        <div className="relative">
          <textarea
            placeholder="Add additional context to the call here"
            value={batchInstructions}
            onChange={(e) => setBatchInstructions(e.target.value)}
            rows={6}
            className="block w-full px-4 py-3 border border-neutral-300 rounded-2xl focus:outline-none text-sm resize-none placeholder:text-[#A3A3A3]"
          />

          {/* Grey divider above mechanisms */}
          {mechanisms.length > 0 && (
            <>
              <div className="absolute bottom-11 left-0 right-0 h-px bg-neutral-300" />

              {/* Mechanisms at bottom left of input */}
              <div className="absolute bottom-3 left-4 flex flex-wrap gap-3">
                {mechanisms.map((mechanism) => (
                  <button
                    key={mechanism.id}
                    type="button"
                    onClick={() => toggleMechanism(mechanism.id)}
                    className={`text-sm transition-colors ${
                      selectedMechanismIds.includes(mechanism.id)
                        ? 'text-neutral-900 font-medium'
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                  >
                    + {mechanism.title}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="bg-neutral-100 border border-neutral-300 rounded-2xl p-4">
            <p className="text-sm text-neutral-900">{error}</p>
          </div>
        )}
      </div>

      {/* Generate Scripts button */}
      <button
        onClick={handleGenerate}
        disabled={!selectedProjectId || projects.length === 0 || isGenerating}
        className="w-full py-3 bg-[#F0F0F0] border border-[#D2D2D2] rounded-full text-sm font-medium text-neutral-900 hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? 'Generating...' : 'Fire Generator'}
      </button>

      {scripts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 mt-12">
            Results
          </h2>
          <div className="grid grid-cols-1 gap-2">
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
