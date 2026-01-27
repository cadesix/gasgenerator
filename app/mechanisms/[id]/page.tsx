import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { MechanismForm } from '@/components/mechanisms/MechanismForm'
import { PageContainer } from '@/components/layout/PageContainer'

export default async function EditMechanismPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const mechanism = await prisma.mechanism.findFirst({
    where: {
      id: (await params).id,
      deletedAt: null
    },
  })

  if (!mechanism) {
    notFound()
  }

  return (
    <PageContainer title={mechanism.title}>
      <MechanismForm mechanism={mechanism} />
    </PageContainer>
  )
}
