import { prisma } from '@/lib/db/prisma'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { PageContainer } from '@/components/layout/PageContainer'
import { EditorCard } from '@/components/editors/EditorCard'

export default async function EditorsPage() {
  const editors = await prisma.editor.findMany({
    where: { deletedAt: null },
    include: {
      _count: {
        select: {
          scripts: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <PageContainer showBackButton={false}>
      <div className="mb-8">
        <h1 className="text-[20px] font-bold text-neutral-900">Editors</h1>
      </div>

      {editors.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              No editors yet
            </h3>
            <p className="text-neutral-600 mb-6">
              Create an editor in Settings to get started
            </p>
            <Link href="/settings">
              <button className="px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-800 text-sm font-medium">
                Go to Settings
              </button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {editors.map((editor) => (
            <EditorCard key={editor.id} editor={editor} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
