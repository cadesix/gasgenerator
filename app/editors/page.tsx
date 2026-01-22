import { prisma } from '@/lib/db/prisma'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

export default async function EditorsPage() {
  const briefs = await prisma.brief.findMany({
    where: {
      deletedAt: null,
      editorId: { not: null },
    },
    include: {
      editor: true,
      script: {
        include: {
          project: true,
          format: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Group briefs by editor
  const editorMap = new Map<string, { id: string; name: string; briefs: typeof briefs }>()
  briefs.forEach((brief) => {
    if (brief.editor) {
      if (!editorMap.has(brief.editor.id)) {
        editorMap.set(brief.editor.id, {
          id: brief.editor.id,
          name: brief.editor.name,
          briefs: []
        })
      }
      editorMap.get(brief.editor.id)!.briefs.push(brief)
    }
  })

  const editors = Array.from(editorMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'Assigned'
      case 'in_progress':
        return 'In Progress'
      case 'completed':
        return 'Completed'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600'
      case 'in_progress':
        return 'text-yellow-600'
      case 'assigned':
        return 'text-neutral-600'
      default:
        return 'text-neutral-600'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Editors</h1>
        <p className="text-neutral-600">View briefs assigned to each editor</p>
      </div>

      {editors.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              No editors assigned yet
            </h3>
            <p className="text-neutral-600 mb-6">
              Assign editors to briefs to see them here
            </p>
            <Link href="/briefs">
              <button className="px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-800 text-sm font-medium">
                Go to Briefs
              </button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          {editors.map((editor) => {
            const completedCount = editor.briefs.filter((b) => b.status === 'completed').length
            const inProgressCount = editor.briefs.filter((b) => b.status === 'in_progress').length
            const assignedCount = editor.briefs.filter((b) => b.status === 'assigned').length

            return (
              <div key={editor.id}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-neutral-900">{editor.name}</h2>
                  <div className="flex gap-4 text-sm">
                    <span className="text-neutral-600">
                      Total: <strong>{editor.briefs.length}</strong>
                    </span>
                    <span className="text-neutral-600">
                      Completed: <strong>{completedCount}</strong>
                    </span>
                    <span className="text-neutral-600">
                      In Progress: <strong>{inProgressCount}</strong>
                    </span>
                    <span className="text-neutral-600">
                      Assigned: <strong>{assignedCount}</strong>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {editor.briefs.map((brief) => {
                    const content = JSON.parse(brief.script.content) as Record<string, string>
                    const firstSection = Object.keys(content)[0]

                    return (
                      <Link key={brief.id} href={`/briefs/${brief.id}`}>
                        <Card className="hover:border-neutral-900 transition-colors cursor-pointer">
                          <div className="space-y-3">
                            <div>
                              <h3 className="text-lg font-semibold text-neutral-900">
                                {brief.script.title}
                              </h3>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="default">{brief.script.project.name}</Badge>
                              </div>
                            </div>

                            {firstSection && (
                              <div>
                                <p className="text-xs font-medium text-neutral-500 uppercase mb-1">{firstSection}:</p>
                                <p className="text-sm text-neutral-700 line-clamp-2">
                                  {content[firstSection]}
                                </p>
                              </div>
                            )}

                            <div className="pt-3 border-t border-neutral-200">
                              <p className={`text-sm font-medium ${getStatusColor(brief.status)}`}>
                                {getStatusLabel(brief.status)}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
