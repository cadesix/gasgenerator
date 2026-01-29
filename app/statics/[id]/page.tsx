import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { StaticDetail } from '@/components/statics/StaticDetail'

export default async function StaticDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const static_ = await prisma.static.findFirst({
    where: {
      id: (await params).id,
      deletedAt: null,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          icon: true,
        },
      },
    },
  })

  if (!static_) {
    notFound()
  }

  return <StaticDetail static={static_} />
}
