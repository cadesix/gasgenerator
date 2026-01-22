import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default async function FormatsPage() {
  const formats = await prisma.scriptFormat.findMany({
    where: { deletedAt: null },
    include: {
      project: true,
      _count: {
        select: {
          savedScripts: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const globalFormats = formats.filter((f) => f.isGlobal)
  const projectFormats = formats.filter((f) => !f.isGlobal)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Script Formats</h1>
          <p className="mt-2 text-neutral-600">
            Create reusable templates for different ad styles
          </p>
        </div>
        <Link href="/formats/new">
          <Button>Create Format</Button>
        </Link>
      </div>

      {formats.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              No formats yet
            </h3>
            <p className="text-neutral-600 mb-6">
              Create your first script format template
            </p>
            <Link href="/formats/new">
              <Button>Create Format</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          {globalFormats.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Global Formats
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {globalFormats.map((format) => (
                  <Link key={format.id} href={`/formats/${format.id}`}>
                    <Card className="hover:border-neutral-900 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {format.name}
                        </h3>
                        <Badge variant="default">Global</Badge>
                      </div>
                      <p className="text-sm text-neutral-600 mb-3">
                        {format.structure}
                      </p>
                      <p className="text-sm text-neutral-500 mb-4">
                        {format.visualDescription}
                      </p>
                      <div className="text-sm text-neutral-500">
                        Used in {format._count.savedScripts} scripts
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {projectFormats.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                App-Specific Formats
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectFormats.map((format) => (
                  <Link key={format.id} href={`/formats/${format.id}`}>
                    <Card className="hover:border-neutral-900 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {format.name}
                        </h3>
                        <Badge variant="success">
                          {format.project?.name}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-600 mb-3">
                        {format.structure}
                      </p>
                      <p className="text-sm text-neutral-500 mb-4">
                        {format.visualDescription}
                      </p>
                      <div className="text-sm text-neutral-500">
                        Used in {format._count.savedScripts} scripts
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
