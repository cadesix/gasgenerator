import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { FormatDetailContent } from '@/components/formats/FormatDetailContent'

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

  return <FormatDetailContent format={format} projects={projects} />
}
