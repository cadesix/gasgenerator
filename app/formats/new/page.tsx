import { prisma } from '@/lib/db/prisma'
import { FormatForm } from '@/components/formats/FormatForm'

export default async function NewFormatPage() {
  const projects = await prisma.project.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Create Format</h1>
        <p className="mt-2 text-neutral-600">
          Define a new script format template
        </p>
      </div>

      <FormatForm projects={projects} />
    </div>
  )
}
