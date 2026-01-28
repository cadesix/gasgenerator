'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ScriptRow } from '@/components/scripts/ScriptRow'

interface Script {
  id: string
  title: string
  content: string
  status: string
  sortOrder: number
  editorId: string | null
  project: {
    name: string
    icon?: string | null
  }
  editor?: {
    id: string
    name: string
  } | null
}

interface Editor {
  id: string
  name: string
}

interface EditorsTablesProps {
  scripts: Script[]
  editors: Editor[]
}

function SortableScriptRow({
  script,
  isExpanded,
  onToggleExpand,
}: {
  script: Script
  isExpanded: boolean
  onToggleExpand: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: script.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms ease',
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <ScriptRow
      ref={setNodeRef}
      style={style}
      script={script}
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      showEditor={false}
      showDragHandle={true}
      dragHandleProps={{ ...attributes, ...listeners }}
    />
  )
}

function EditorTable({
  editor,
  scripts: initialScripts,
  expandedIds,
  onToggleExpand,
  onReorder,
}: {
  editor: Editor
  scripts: Script[]
  expandedIds: Set<string>
  onToggleExpand: (id: string) => void
  onReorder: (editorId: string, scripts: Script[]) => void
}) {
  const [scripts, setScripts] = useState(initialScripts)

  // Sync with server state when it changes
  useEffect(() => {
    setScripts(initialScripts)
  }, [initialScripts])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = scripts.findIndex((s) => s.id === active.id)
      const newIndex = scripts.findIndex((s) => s.id === over.id)

      const newScripts = arrayMove(scripts, oldIndex, newIndex)

      // Optimistic update
      setScripts(newScripts)

      // Sync with server in background
      onReorder(editor.id, newScripts)
    }
  }

  const activeScripts = scripts.filter((s) => s.status !== 'completed')

  return (
    <div className="mb-8">
      <h2 className="text-sm font-semibold text-neutral-900 mb-3">{editor.name}</h2>
      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider w-12">
                  App
                </th>
                <th className="px-4 py-3"></th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              <SortableContext
                items={activeScripts.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {activeScripts.map((script) => (
                  <SortableScriptRow
                    key={script.id}
                    script={script}
                    isExpanded={expandedIds.has(script.id)}
                    onToggleExpand={() => onToggleExpand(script.id)}
                  />
                ))}
              </SortableContext>
              <tr className="border-t border-neutral-200">
                <td colSpan={3} className="px-4 py-3">
                  <button className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors">
                    + Add script
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </DndContext>
      </div>
    </div>
  )
}

export function EditorsTables({ scripts, editors }: EditorsTablesProps) {
  const router = useRouter()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const scriptsByEditor = editors.reduce((acc, editor) => {
    acc[editor.id] = scripts
      .filter((s) => s.editorId === editor.id)
      .sort((a, b) => a.sortOrder - b.sortOrder)
    return acc
  }, {} as Record<string, Script[]>)

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleReorder = async (editorId: string, reorderedScripts: Script[]) => {
    try {
      // Update sort order for all scripts in this editor's list
      const updates = reorderedScripts.map((script, index) => ({
        id: script.id,
        sortOrder: index,
      }))

      const response = await fetch('/api/scripts/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      })

      if (!response.ok) throw new Error('Failed to reorder scripts')

      // Don't refresh immediately - let optimistic update handle it
    } catch (error) {
      console.error('Error reordering scripts:', error)
      // On error, refresh to revert to server state
      router.refresh()
    }
  }

  return (
    <div>
      {editors.map((editor) => (
        <EditorTable
          key={editor.id}
          editor={editor}
          scripts={scriptsByEditor[editor.id] || []}
          expandedIds={expandedIds}
          onToggleExpand={handleToggleExpand}
          onReorder={handleReorder}
        />
      ))}
    </div>
  )
}
