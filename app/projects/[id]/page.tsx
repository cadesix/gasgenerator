import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { ProjectForm } from '@/components/projects/ProjectForm'

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const project = await prisma.project.findFirst({
    where: {
      id: (await params).id,
      deletedAt: null
    },
  })

  if (!project) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">{project.name}</h1>
        <p className="mt-2 text-neutral-600">Edit app details</p>
      </div>

      <ProjectForm project={project} />
    </div>
  )
}
