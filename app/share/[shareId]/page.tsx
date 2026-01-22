import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default async function ShareScriptPage({
  params,
}: {
  params: Promise<{ shareId: string }>
}) {
  const script = await prisma.savedScript.findFirst({
    where: {
      shareId: (await params).shareId,
      deletedAt: null
    },
    include: {
      project: true,
      format: true,
    },
  })

  if (!script) {
    notFound()
  }

  // Parse content JSON to get sections
  const content = JSON.parse(script.content) as Record<string, string>
  const sections = Object.keys(content)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="h-6 w-6 text-neutral-900"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="text-sm font-medium text-neutral-600">
            Shared Script
          </span>
        </div>

        <h1 className="text-4xl font-bold text-neutral-900 mb-4">
          {script.title}
        </h1>

        <div className="flex gap-2">
          <Badge variant="default">{script.project.name}</Badge>
          {script.format && (
            <Badge variant="success">{script.format.name}</Badge>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <Card key={section}>
            <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
              {section}
            </h2>
            <div className={`${index === 0 ? 'bg-neutral-100 border border-neutral-300' : 'bg-neutral-50 border border-neutral-200'} p-6`}>
              <p className="text-lg text-neutral-900 whitespace-pre-wrap leading-relaxed">
                {content[section]}
              </p>
            </div>
          </Card>
        ))}

        {script.format && (
          <Card className="bg-neutral-50 border-neutral-300">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">
              Format Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
                  Structure
                </p>
                <p className="text-sm text-neutral-800">{script.format.structure}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
                  Visual Description
                </p>
                <p className="text-sm text-neutral-800">
                  {script.format.visualDescription}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-neutral-200 text-center">
        <p className="text-sm text-neutral-500">
          Generated with Ad Script Generator
        </p>
      </div>
    </div>
  )
}
