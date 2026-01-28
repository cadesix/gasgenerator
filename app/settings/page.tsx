'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { PageContainer } from '@/components/layout/PageContainer'

interface Project {
  id: string
  name: string
  description: string
  targetAudience: string
  icon?: string | null
  _count?: {
    formats: number
    savedScripts: number
  }
}

interface Format {
  id: string
  name: string
  structure: string
  isGlobal: boolean
  projectId: string | null
}

interface Editor {
  id: string
  name: string
  notes?: string | null
  _count?: {
    briefs: number
  }
}

interface Mechanism {
  id: string
  title: string
  content: string
}

interface PromptHistoryItem {
  id: string
  prompt: string
  updatedAt: string
}

export default function SettingsPage() {
  const router = useRouter()

  // Projects state
  const [projects, setProjects] = useState<Project[]>([])

  // Formats state
  const [formats, setFormats] = useState<Format[]>([])

  // Editors state
  const [editors, setEditors] = useState<Editor[]>([])
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false)
  const [editingEditor, setEditingEditor] = useState<Editor | null>(null)
  const [editorFormData, setEditorFormData] = useState({ name: '', notes: '' })

  // Mechanisms state
  const [mechanisms, setMechanisms] = useState<Mechanism[]>([])

  // Prompt history state
  const [prompts, setPrompts] = useState<PromptHistoryItem[]>([])
  const [promptsExpanded, setPromptsExpanded] = useState(false)

  // Formats expansion state
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set())

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      const [projectsRes, formatsRes, editorsRes, mechanismsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/formats'),
        fetch('/api/editors'),
        fetch('/api/mechanisms'),
      ])

      if (projectsRes.ok) setProjects(await projectsRes.json())
      if (formatsRes.ok) setFormats(await formatsRes.json())
      if (editorsRes.ok) setEditors(await editorsRes.json())
      if (mechanismsRes.ok) setMechanisms(await mechanismsRes.json())
    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Failed to load settings data')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPrompts = async () => {
    try {
      const response = await fetch('/api/prompts?limit=50')
      if (response.ok) {
        const data = await response.json()
        setPrompts(data.prompts)
      }
    } catch (error) {
      console.error('Error fetching prompts:', error)
    }
  }

  const handleTogglePrompts = () => {
    if (!promptsExpanded && prompts.length === 0) {
      fetchPrompts()
    }
    setPromptsExpanded(!promptsExpanded)
  }

  // Editor handlers
  const handleOpenEditorModal = (editor?: Editor) => {
    if (editor) {
      setEditingEditor(editor)
      setEditorFormData({ name: editor.name, notes: editor.notes || '' })
    } else {
      setEditingEditor(null)
      setEditorFormData({ name: '', notes: '' })
    }
    setIsEditorModalOpen(true)
  }

  const handleSaveEditor = async () => {
    if (!editorFormData.name.trim()) {
      alert('Please enter a name')
      return
    }

    setIsSaving(true)
    try {
      const url = editingEditor ? `/api/editors/${editingEditor.id}` : '/api/editors'
      const method = editingEditor ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editorFormData.name.trim(),
          notes: editorFormData.notes.trim() || null,
        }),
      })

      if (!response.ok) throw new Error('Failed to save editor')

      await fetchAllData()
      setIsEditorModalOpen(false)
      setEditingEditor(null)
      setEditorFormData({ name: '', notes: '' })
    } catch (error) {
      console.error('Error saving editor:', error)
      alert('Failed to save editor. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Format handlers
  const toggleProjectExpansion = (projectId: string) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev)
      if (newSet.has(projectId)) {
        newSet.delete(projectId)
      } else {
        newSet.add(projectId)
      }
      return newSet
    })
  }

  // Group formats by project
  const globalFormats = formats.filter(f => f.isGlobal)
  const formatsByProject = projects.map(project => ({
    project,
    formats: formats.filter(f => f.projectId === project.id)
  })).filter(group => group.formats.length > 0)

  // Mechanism handlers
  const handleDeleteMechanism = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mechanism?')) return

    setDeletingId(id)
    try {
      const response = await fetch(`/api/mechanisms/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete mechanism')
      await fetchAllData()
    } catch (error) {
      console.error('Error deleting mechanism:', error)
      alert('Failed to delete mechanism. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-neutral-600">Loading settings...</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <>
      <PageContainer
        title="Settings"
        showBackButton={false}
      >

        <div className="space-y-12">
          {/* Apps Section */}
          <section>
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] font-bold text-neutral-900">Apps</h2>
                <button
                  onClick={() => router.push('/projects/new')}
                  className="flex items-center justify-center w-6 h-6 rounded-full border border-neutral-300 hover:border-neutral-900 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <p className="text-sm text-neutral-600 mt-1">Manage your apps/projects</p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  onClick={() => router.push(`/projects/${project.id}`)}
                  className={`cursor-pointer group px-6 py-4 hover:bg-neutral-50 transition-colors ${
                    index > 0 ? 'border-t border-neutral-200' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {project.icon ? (
                        <img
                          src={project.icon}
                          alt={project.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-neutral-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-neutral-500 text-xs font-medium">
                            {project.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-neutral-900">{project.name}</h3>
                        {project._count && (
                          <p className="text-sm text-neutral-500 mt-0.5">
                            {project._count.formats} format{project._count.formats !== 1 ? 's' : ''} · {project._count.savedScripts} script{project._count.savedScripts !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Formats Section */}
          <section>
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] font-bold text-neutral-900">Formats</h2>
                <button
                  onClick={() => router.push('/formats/new')}
                  className="flex items-center justify-center w-6 h-6 rounded-full border border-neutral-300 hover:border-neutral-900 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <p className="text-sm text-neutral-600 mt-1">Manage script formats by project</p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
              {/* Global Formats */}
              {globalFormats.length > 0 && (
                <>
                  <div
                    onClick={() => toggleProjectExpansion('global')}
                    className="cursor-pointer px-6 py-4 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <svg
                          className={`w-4 h-4 text-neutral-400 transition-transform ${
                            expandedProjects.has('global') ? 'rotate-90' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <div>
                          <h3 className="text-base font-semibold text-neutral-900">Global Formats</h3>
                          <p className="text-sm text-neutral-500 mt-0.5">
                            {globalFormats.length} format{globalFormats.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {expandedProjects.has('global') && globalFormats.map((format, index) => (
                    <div
                      key={format.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/formats/${format.id}`)
                      }}
                      className="cursor-pointer group px-6 py-3 pl-16 hover:bg-neutral-50 transition-colors border-t border-neutral-100"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-neutral-900 mb-1">{format.name}</h4>
                          <p className="text-xs text-neutral-600 line-clamp-1">{format.structure}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Project-specific Formats */}
              {formatsByProject.map((group, groupIndex) => (
                <div key={group.project.id}>
                  <div
                    onClick={() => toggleProjectExpansion(group.project.id)}
                    className={`cursor-pointer px-6 py-4 hover:bg-neutral-50 transition-colors ${
                      groupIndex > 0 || globalFormats.length > 0 ? 'border-t border-neutral-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <svg
                          className={`w-4 h-4 text-neutral-400 transition-transform ${
                            expandedProjects.has(group.project.id) ? 'rotate-90' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {group.project.icon ? (
                          <img
                            src={group.project.icon}
                            alt={group.project.name}
                            className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-neutral-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-neutral-500 text-xs font-medium">
                              {group.project.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="text-base font-semibold text-neutral-900">{group.project.name}</h3>
                          <p className="text-sm text-neutral-500 mt-0.5">
                            {group.formats.length} format{group.formats.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {expandedProjects.has(group.project.id) && group.formats.map((format) => (
                    <div
                      key={format.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/formats/${format.id}`)
                      }}
                      className="cursor-pointer group px-6 py-3 pl-16 hover:bg-neutral-50 transition-colors border-t border-neutral-100"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-neutral-900 mb-1">{format.name}</h4>
                          <p className="text-xs text-neutral-600 line-clamp-1">{format.structure}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {formats.length === 0 && (
                <div className="px-6 py-8 text-center text-neutral-500">
                  No formats yet. Create your first format to get started.
                </div>
              )}
            </div>
          </section>

          {/* Editors Section */}
          <section>
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] font-bold text-neutral-900">Editors</h2>
                <button
                  onClick={() => handleOpenEditorModal()}
                  className="flex items-center justify-center w-6 h-6 rounded-full border border-neutral-300 hover:border-neutral-900 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <p className="text-sm text-neutral-600 mt-1">Manage editors who can be assigned to briefs</p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
              {editors.map((editor, index) => (
                <div
                  key={editor.id}
                  onClick={() => handleOpenEditorModal(editor)}
                  className={`cursor-pointer group px-6 py-4 hover:bg-neutral-50 transition-colors ${
                    index > 0 ? 'border-t border-neutral-200' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-neutral-900 mb-1">{editor.name}</h3>
                      {editor.notes && (
                        <p className="text-sm text-neutral-600 line-clamp-1">{editor.notes}</p>
                      )}
                    </div>
                    {editor._count && editor._count.briefs > 0 && (
                      <div className="text-sm text-neutral-500">
                        {editor._count.briefs} brief{editor._count.briefs !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mechanisms Section */}
          <section>
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] font-bold text-neutral-900">Mechanisms</h2>
                <button
                  onClick={() => router.push('/mechanisms/new')}
                  className="flex items-center justify-center w-6 h-6 rounded-full border border-neutral-300 hover:border-neutral-900 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <p className="text-sm text-neutral-600 mt-1">Copywriting principles to use as context when generating scripts</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {mechanisms.map((mechanism) => (
                <div key={mechanism.id} onClick={() => router.push(`/mechanisms/${mechanism.id}`)} className="cursor-pointer group">
                  <Card className="transition-transform duration-200 ease-out group-hover:scale-[1.02] origin-center">
                    <div className="transition-transform duration-200 ease-out group-hover:scale-[0.9804] origin-center">
                      <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-neutral-900">{mechanism.title}</h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteMechanism(mechanism.id)
                          }}
                          disabled={deletingId === mechanism.id}
                          className="text-sm text-neutral-900 hover:text-neutral-600 disabled:opacity-50"
                        >
                          {deletingId === mechanism.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                      <p className="text-sm text-neutral-700 whitespace-pre-wrap line-clamp-3">{mechanism.content}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </section>

          {/* Prompt History Section */}
          <section>
            <div className="mb-4">
              <h2 className="text-[20px] font-bold text-neutral-900">Prompt History</h2>
              <p className="text-sm text-neutral-600 mt-1">View your recent prompts used for script generation</p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
              <div
                onClick={handleTogglePrompts}
                className="cursor-pointer px-6 py-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <svg
                      className={`w-4 h-4 text-neutral-400 transition-transform ${
                        promptsExpanded ? 'rotate-90' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div>
                      <h3 className="text-base font-semibold text-neutral-900">View All Prompts</h3>
                      {prompts.length > 0 && (
                        <p className="text-sm text-neutral-500 mt-0.5">
                          {prompts.length} prompt{prompts.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {promptsExpanded && (
                <div className="border-t border-neutral-200">
                  {prompts.length === 0 ? (
                    <div className="px-6 py-8 text-center text-neutral-500">
                      No prompts yet
                    </div>
                  ) : (
                    <div className="divide-y divide-neutral-100 max-h-96 overflow-y-auto">
                      {prompts.map((prompt) => (
                        <div
                          key={prompt.id}
                          className="px-6 py-4 hover:bg-neutral-50 transition-colors"
                        >
                          <p className="text-sm text-neutral-900 whitespace-pre-wrap mb-2">{prompt.prompt}</p>
                          <p className="text-xs text-neutral-400">
                            Last used: {new Date(prompt.updatedAt).toLocaleDateString()} at {new Date(prompt.updatedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </PageContainer>

      {/* Editor Modal */}
      <Modal
        isOpen={isEditorModalOpen}
        onClose={() => {
          setIsEditorModalOpen(false)
          setEditingEditor(null)
          setEditorFormData({ name: '', notes: '' })
        }}
        title={editingEditor ? 'Edit Editor' : 'Add Editor'}
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={editorFormData.name}
            onChange={(e) => setEditorFormData({ ...editorFormData, name: e.target.value })}
            placeholder="Enter editor name"
          />
          <Textarea
            label="Notes"
            rows={6}
            value={editorFormData.notes}
            onChange={(e) => setEditorFormData({ ...editorFormData, notes: e.target.value })}
            placeholder="Add notes about this editor..."
          />
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setIsEditorModalOpen(false)
                setEditingEditor(null)
                setEditorFormData({ name: '', notes: '' })
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEditor} isLoading={isSaving}>
              {editingEditor ? 'Update' : 'Add'} Editor
            </Button>
          </div>
        </div>
      </Modal>

    </>
  )
}
