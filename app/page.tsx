import { prisma } from '@/lib/db/prisma'
import { HomeScriptGenerator } from '@/components/scripts/HomeScriptGenerator'

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <HomeScriptGenerator projects={projects} formats={formats} />
    </div>
  )
}
