import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { ProjectActions } from '@/components/projects/ProjectActions'
import { ProjectDetail } from '@/components/projects/ProjectDetail'

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const project = await prisma.project.findUnique({
    where: { id: (await params).id, deletedAt: null },
  })

  if (!project) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">
          {project.name}
        </h1>
        <ProjectActions projectId={project.id} />
      </div>

      <ProjectDetail project={project} />
    </div>
  )
}
