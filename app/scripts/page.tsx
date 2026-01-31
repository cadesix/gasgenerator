import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import { Card } from '@/components/ui/Card'
import { ScriptsTable } from '@/components/scripts/ScriptsTable'
import { PageContainer } from '@/components/layout/PageContainer'
import { ScriptsPageHeader } from '@/components/scripts/ScriptsPageHeader'

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
      editor: true,
    },
    orderBy: { savedAt: 'desc' },
  })

  const [projectsData, formats] = await Promise.all([
    prisma.project.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true, icon: true },
      orderBy: { name: 'asc' },
    }),
    prisma.scriptFormat.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true, sections: true, isGlobal: true, projectId: true },
      orderBy: [{ isGlobal: 'desc' }, { name: 'asc' }],
    }),
  ])

  const projects = projectsData

  return (
    <PageContainer showBackButton={false}>
      <div className="mb-8 flex items-center gap-4 flex-wrap">
        <ScriptsPageHeader projects={projects} formats={formats} />
        {projects.length > 0 && (
          <>
          <Link href="/scripts">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !params.project
                  ? 'bg-[#F0F0F0] text-neutral-900 border border-[#ABABAB]'
                  : 'bg-[#F0F0F0] text-neutral-700 hover:bg-neutral-200 border border-transparent'
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
                    ? 'bg-[#F0F0F0] text-neutral-900 border border-[#ABABAB]'
                    : 'bg-[#F0F0F0] text-neutral-700 hover:bg-neutral-200 border border-transparent'
                }`}
              >
                {project.name}
              </button>
            </Link>
          ))}
          </>
        )}
      </div>

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
        <div className="space-y-8">
          {scripts.filter(s => s.status === 'unassigned').length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 mb-3">Unassigned</h2>
              <ScriptsTable scripts={scripts.filter(s => s.status === 'unassigned')} />
            </div>
          )}
          {scripts.filter(s => s.status !== 'unassigned').length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 mb-3">Assigned</h2>
              <ScriptsTable scripts={scripts.filter(s => s.status !== 'unassigned')} />
            </div>
          )}
        </div>
      )}
    </PageContainer>
  )
}
