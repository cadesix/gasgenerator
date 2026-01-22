import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { FormatDetail } from '@/components/formats/FormatDetail'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function FormatDetailPage({ params }: PageProps) {
  const { id } = await params

  const format = await prisma.scriptFormat.findFirst({
    where: {
      id,
      deletedAt: null
    },
  })

  if (!format) {
    notFound()
  }

  const projects = await prisma.project.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">
          {format.name}
        </h1>
      </div>

      <FormatDetail format={format} projects={projects} />
    </div>
  )
}
