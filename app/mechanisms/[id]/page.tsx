import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { MechanismForm } from '@/components/mechanisms/MechanismForm'

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">{mechanism.title}</h1>
        <p className="mt-2 text-neutral-600">Edit mechanism details</p>
      </div>

      <MechanismForm mechanism={mechanism} />
    </div>
  )
}
