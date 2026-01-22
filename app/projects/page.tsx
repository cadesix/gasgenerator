import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { deletedAt: null },
    include: {
      _count: {
        select: {
          savedScripts: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Apps</h1>
          <p className="mt-2 text-neutral-600">
            Manage your product campaigns and generate scripts
          </p>
        </div>
        <Link href="/projects/new">
          <Button>Create App</Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              No apps yet
            </h3>
            <p className="text-neutral-600 mb-6">
              Get started by creating your first app
            </p>
            <Link href="/projects/new">
              <Button>Create App</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="hover:border-primary-300 transition-colors cursor-pointer h-full">
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {project.name}
                </h3>
                <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">
                    {project._count.savedScripts} saved scripts
                  </span>
                  <span className="text-primary-600 font-medium">
                    View →
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
