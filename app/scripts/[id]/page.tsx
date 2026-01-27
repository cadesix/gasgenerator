import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { ScriptDetailContent } from '@/components/scripts/ScriptDetailContent'

export default async function ScriptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const script = await prisma.savedScript.findFirst({
    where: {
      id: (await params).id,
      deletedAt: null
    },
    include: {
      project: {
        select: {
          name: true,
        },
      },
      format: {
        select: {
          name: true,
          structure: true,
          visualDescription: true,
          referenceVideos: true,
          footageLinks: true,
        },
      },
      editor: true,
    },
  })

  if (!script) {
    notFound()
  }

  return <ScriptDetailContent script={script} />
}
