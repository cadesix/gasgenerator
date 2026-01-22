import { prisma } from '@/lib/db/prisma'
import { IdeaForm } from '@/components/ideas/IdeaForm'
import { IdeaList } from '@/components/ideas/IdeaList'

export default async function IdeasPage() {
  const [ideas, projects] = await Promise.all([
    prisma.idea.findMany({
      where: { deletedAt: null },
      include: {
        project: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.project.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Ideas</h1>
        <p className="text-neutral-600">
          Capture ideas for future scripts
        </p>
      </div>

      <div className="space-y-6">
        <IdeaForm projects={projects} />
        <IdeaList ideas={ideas} />
      </div>
    </div>
  )
}
