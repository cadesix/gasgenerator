'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { OverflowMenu, OverflowMenuItem } from '@/components/ui/OverflowMenu'

interface Editor {
  id: string
  name: string
}

interface ScriptDetailActionsProps {
  scriptId: string
  currentEditorId: string | null
  currentEditor: { id: string; name: string } | null
  currentStatus: string
}

export function ScriptDetailActions({
  scriptId,
  currentEditorId,
  currentEditor,
  currentStatus
}: ScriptDetailActionsProps) {
  const router = useRouter()
  const [editors, setEditors] = useState<Editor[]>([])
  const [status, setStatus] = useState(currentStatus || 'assigned')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    fetchEditors()
  }, [])

  const fetchEditors = async () => {
    try {
      const response = await fetch('/api/editors')
      if (!response.ok) throw new Error('Failed to fetch editors')
      const data = await response.json()
      setEditors(data)
    } catch (error) {
      console.error('Error fetching editors:', error)
    }
  }

  const handleUpdate = async (field: string, value: string | null) => {
    setIsUpdating(true)

    try {
      const response = await fetch(`/api/scripts/${scriptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })

      if (!response.ok) throw new Error('Failed to update script')

      router.refresh()
    } catch (error) {
      console.error('Error updating script:', error)
      alert('Failed to update script. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unassigned':
        return 'bg-neutral-400'
      case 'assigned':
        return 'bg-neutral-400'
      case 'in_progress':
        return 'bg-yellow-500'
      case 'completed':
        return 'bg-green-500'
      default:
        return 'bg-neutral-400'
    }
  }

  const copyScriptLink = () => {
    const url = `${window.location.origin}/scripts/${scriptId}`
    navigator.clipboard.writeText(url)
    alert('Script link copied to clipboard!')
  }

  return (
    <div className="flex items-center gap-3">
      {/* Status Dropdown */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-neutral-500">
          Status:
        </label>
        <div className="relative">
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${getStatusColor(status)}`} />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              handleUpdate('status', e.target.value)
            }}
            className="pl-8 pr-10 py-1.5 text-sm border border-neutral-300 rounded-full focus:outline-none appearance-none bg-white cursor-pointer"
            disabled={isUpdating}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
            }}
          >
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Copy Link Button */}
      <button
        onClick={copyScriptLink}
        className="text-neutral-500 hover:text-neutral-900"
        title="Copy script link"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>

      {/* Overflow Menu for Editor */}
      <OverflowMenu>
        <div className="px-4 py-2 text-xs font-medium text-neutral-500 uppercase">
          Change Editor
        </div>
        <button
          onClick={() => handleUpdate('editorId', null)}
          disabled={isUpdating || !currentEditorId}
          className="w-full text-left"
        >
          <OverflowMenuItem>
            {currentEditorId ? 'Unassign Editor' : 'No Editor'}
          </OverflowMenuItem>
        </button>
        <div className="border-t border-neutral-200 my-1" />
        {editors.map((editor) => (
          <button
            key={editor.id}
            onClick={() => handleUpdate('editorId', editor.id)}
            disabled={isUpdating || currentEditorId === editor.id}
            className="w-full text-left"
          >
            <OverflowMenuItem>
              {editor.name}
              {currentEditorId === editor.id && ' ✓'}
            </OverflowMenuItem>
          </button>
        ))}
      </OverflowMenu>
    </div>
  )
}
