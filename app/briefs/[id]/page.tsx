import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { BriefDetailActions } from '@/components/briefs/BriefDetailActions'

export default async function BriefDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const brief = await prisma.brief.findFirst({
    where: {
      id: (await params).id,
      deletedAt: null
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
  })

  if (!brief) {
    notFound()
  }

  // Parse content JSON to get sections
  const content = JSON.parse(brief.script.content) as Record<string, string>
  const sections = Object.keys(content)

  // Get reference videos and footage from the format
  const referenceVideos = brief.script.format
    ? JSON.parse(brief.script.format.referenceVideos) as string[]
    : []
  const footageLinks = brief.script.format
    ? JSON.parse(brief.script.format.footageLinks) as string[]
    : []

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-3">
          <h1 className="text-3xl font-bold text-neutral-900">
            {brief.script.title}
          </h1>
          <BriefDetailActions
            briefId={brief.id}
            currentEditorId={brief.editorId}
            currentEditor={brief.editor}
            currentStatus={brief.status}
          />
        </div>
        <div className="flex gap-2">
          <Badge variant="default">{brief.script.project.name}</Badge>
          {brief.script.format && (
            <Badge variant="success">{brief.script.format.name}</Badge>
          )}
          {brief.editor && (
            <Badge variant="default">Editor: {brief.editor.name}</Badge>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Script Content */}
        <Card>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Script
          </h2>
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div key={section} className={index > 0 ? 'pt-4 border-t border-neutral-200' : ''}>
                <h3 className="text-sm font-semibold text-neutral-500 uppercase mb-2">
                  {section}
                </h3>
                <div className={`${index === 0 ? 'bg-neutral-100 border border-neutral-300' : 'bg-neutral-50 border border-neutral-200'} rounded-md p-4`}>
                  <p className="text-neutral-900 whitespace-pre-wrap">{content[section]}</p>
                </div>
              </div>
            ))}
          </div>
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

        {/* Brief Notes */}
        {brief.notes && (
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Notes
            </h2>
            <p className="text-sm text-neutral-700 whitespace-pre-wrap">{brief.notes}</p>
          </Card>
        )}
      </div>
    </div>
  )
}
