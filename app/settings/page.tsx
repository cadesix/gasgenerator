'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'

interface Project {
  id: string
  name: string
  description: string
  targetAudience: string
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
  _count?: {
    briefs: number
  }
}

interface Mechanism {
  id: string
  title: string
  content: string
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
  const [editorFormData, setEditorFormData] = useState({ name: '' })

  // Mechanisms state
  const [mechanisms, setMechanisms] = useState<Mechanism[]>([])

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

  // Editor handlers
  const handleOpenEditorModal = (editor?: Editor) => {
    if (editor) {
      setEditingEditor(editor)
      setEditorFormData({ name: editor.name })
    } else {
      setEditingEditor(null)
      setEditorFormData({ name: '' })
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
        body: JSON.stringify({ name: editorFormData.name.trim() }),
      })

      if (!response.ok) throw new Error('Failed to save editor')

      await fetchAllData()
      setIsEditorModalOpen(false)
      setEditingEditor(null)
      setEditorFormData({ name: '' })
    } catch (error) {
      console.error('Error saving editor:', error)
      alert('Failed to save editor. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-neutral-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">Settings</h1>

        <div className="space-y-12">
          {/* Apps Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-neutral-900">Apps</h2>
                <p className="text-sm text-neutral-600 mt-1">Manage your apps/projects</p>
              </div>
              <Button onClick={() => router.push('/projects/new')}>Add App</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Card key={project.id}>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-neutral-900">{project.name}</h3>
                    {project._count && (
                      <div className="text-sm text-neutral-500 pt-3 border-t border-neutral-200">
                        {project._count.formats} format{project._count.formats !== 1 ? 's' : ''} · {project._count.savedScripts} script{project._count.savedScripts !== 1 ? 's' : ''}
                      </div>
                    )}
                    <div className="pt-3 border-t border-neutral-200">
                      <button
                        onClick={() => router.push(`/projects/${project.id}`)}
                        className="text-sm text-neutral-900 hover:text-neutral-600"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Formats Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-neutral-900">Formats</h2>
                <p className="text-sm text-neutral-600 mt-1">Manage script formats</p>
              </div>
              <Button onClick={() => router.push('/formats/new')}>Add Format</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formats.map((format) => (
                <Card key={format.id}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-neutral-900">{format.name}</h3>
                      {format.isGlobal ? (
                        <span className="text-xs bg-neutral-900 text-white px-2 py-1 rounded">Global</span>
                      ) : (
                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">App-specific</span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 line-clamp-2">{format.structure}</p>
                    <div className="pt-3 border-t border-neutral-200">
                      <button
                        onClick={() => router.push(`/formats/${format.id}`)}
                        className="text-sm text-neutral-900 hover:text-neutral-600"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Editors Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-neutral-900">Editors</h2>
                <p className="text-sm text-neutral-600 mt-1">Manage editors who can be assigned to briefs</p>
              </div>
              <Button onClick={() => handleOpenEditorModal()}>Add Editor</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {editors.map((editor) => (
                <Card key={editor.id}>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-neutral-900">{editor.name}</h3>
                    {editor._count && (
                      <div className="text-sm text-neutral-500 pt-3 border-t border-neutral-200">
                        {editor._count.briefs} brief{editor._count.briefs !== 1 ? 's' : ''} assigned
                      </div>
                    )}
                    <div className="pt-3 border-t border-neutral-200">
                      <button
                        onClick={() => handleOpenEditorModal(editor)}
                        className="text-sm text-neutral-900 hover:text-neutral-600"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Mechanisms Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-neutral-900">Mechanisms</h2>
                <p className="text-sm text-neutral-600 mt-1">Copywriting principles to use as context when generating scripts</p>
              </div>
              <Button onClick={() => router.push('/mechanisms/new')}>Add Mechanism</Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {mechanisms.map((mechanism) => (
                <Card key={mechanism.id}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-neutral-900">{mechanism.title}</h3>
                      <div className="flex gap-3">
                        <button
                          onClick={() => router.push(`/mechanisms/${mechanism.id}`)}
                          className="text-sm text-neutral-900 hover:text-neutral-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMechanism(mechanism.id)}
                          disabled={deletingId === mechanism.id}
                          className="text-sm text-neutral-900 hover:text-neutral-600 disabled:opacity-50"
                        >
                          {deletingId === mechanism.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-700 whitespace-pre-wrap line-clamp-3">{mechanism.content}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Editor Modal */}
      <Modal
        isOpen={isEditorModalOpen}
        onClose={() => {
          setIsEditorModalOpen(false)
          setEditingEditor(null)
          setEditorFormData({ name: '' })
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
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setIsEditorModalOpen(false)
                setEditingEditor(null)
                setEditorFormData({ name: '' })
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
