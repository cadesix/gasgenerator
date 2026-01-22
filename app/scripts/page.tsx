import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import { Card } from '@/components/ui/Card'
import { ScriptCard } from '@/components/scripts/ScriptCard'

interface PageProps {
  searchParams: Promise<{ project?: string }>
}

export default async function ScriptsPage({ searchParams }: PageProps) {
  const params = await searchParams

  const scripts = await prisma.savedScript.findMany({
    where: {
      deletedAt: null,
      ...(params.project && { projectId: params.project }),
    },
    include: {
      project: true,
      format: true,
      brief: true,
    },
    orderBy: { savedAt: 'desc' },
  })

  const projects = await prisma.project.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Scripts
        </h1>
        <p className="text-neutral-600">
          Your saved ad scripts
        </p>
      </div>

      {projects.length > 0 && (
        <div className="mb-6 flex gap-2 flex-wrap">
          <Link href="/scripts">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !params.project
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              All Apps
            </button>
          </Link>
          {projects.map((project) => (
            <Link key={project.id} href={`/scripts?project=${project.id}`}>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  params.project === project.id
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {project.name}
              </button>
            </Link>
          ))}
        </div>
      )}

      {scripts.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              No saved scripts yet
            </h3>
            <p className="text-neutral-600 mb-6">
              Generate and save your first script to see it here
            </p>
            <Link href="/projects">
              <button className="px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-800 text-sm font-medium">
                Go to Apps
              </button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scripts.map((script) => (
            <ScriptCard key={script.id} script={script} />
          ))}
        </div>
      )}
    </div>
  )
}
