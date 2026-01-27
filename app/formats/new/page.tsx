import { prisma } from '@/lib/db/prisma'
import { FormatForm } from '@/components/formats/FormatForm'
import { PageContainer } from '@/components/layout/PageContainer'

export default async function NewFormatPage() {
  const projects = await prisma.project.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })

  return (
    <PageContainer title="Create Format">
      <FormatForm projects={projects} />
    </PageContainer>
  )
}
