import { prisma } from '@/lib/db/prisma'
import { IdeaForm } from '@/components/ideas/IdeaForm'
import { IdeaList } from '@/components/ideas/IdeaList'
import { PageContainer } from '@/components/layout/PageContainer'

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
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-[20px] font-bold text-neutral-900">Ideas</h1>
      </div>

      <div className="space-y-6">
        <IdeaForm projects={projects} />
        <IdeaList ideas={ideas} />
      </div>
    </PageContainer>
  )
}
