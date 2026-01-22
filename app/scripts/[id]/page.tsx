import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DeleteScriptButton } from '@/components/scripts/DeleteScriptButton'
import { CreateBriefButton } from '@/components/scripts/CreateBriefButton'
import { EditableScriptContent } from '@/components/scripts/EditableScriptContent'

export default async function ScriptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const script = await prisma.savedScript.findFirst({
    where: {
      id: (await params).id,
      deletedAt: null
    },
    include: {
      project: true,
      format: true,
      brief: true,
    },
  })

  if (!script) {
    notFound()
  }

  // Parse content JSON to get sections
  const content = JSON.parse(script.content) as Record<string, string>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-3">
            {script.title}
          </h1>
          <div className="flex gap-2">
            <Badge variant="default">{script.project.name}</Badge>
            {script.format && (
              <Badge variant="success">{script.format.name}</Badge>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          {!script.brief && <CreateBriefButton scriptId={script.id} />}
          {script.brief && (
            <Link href={`/briefs/${script.brief.id}`}>
              <Button variant="ghost">View Brief</Button>
            </Link>
          )}
          <DeleteScriptButton scriptId={script.id} />
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <EditableScriptContent
            scriptId={script.id}
            initialContent={content}
          />
        </Card>

        {script.format && (
          <Card>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
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

        <div className="text-sm text-neutral-500">
          Saved on {new Date(script.savedAt).toLocaleDateString()} at{' '}
          {new Date(script.savedAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
