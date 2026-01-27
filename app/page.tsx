import { prisma } from '@/lib/db/prisma'
import { HomeScriptGenerator } from '@/components/scripts/HomeScriptGenerator'
import { PageContainer } from '@/components/layout/PageContainer'

export default async function HomePage() {
  const projects = await prisma.project.findMany({
    where: { deletedAt: null },
    orderBy: { name: 'asc' },
  })

  const formats = await prisma.scriptFormat.findMany({
    where: { deletedAt: null },
    orderBy: [
      { isGlobal: 'desc' },
      { name: 'asc' },
    ],
  })

  const mechanisms = await prisma.mechanism.findMany({
    where: { deletedAt: null },
    orderBy: { title: 'asc' },
  })

  return (
    <PageContainer showBackButton={false}>
      <HomeScriptGenerator projects={projects} formats={formats} mechanisms={mechanisms} />
    </PageContainer>
  )
}
