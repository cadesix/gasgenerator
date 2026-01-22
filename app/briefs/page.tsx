import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import { Card } from '@/components/ui/Card'
import { BriefCard } from '@/components/briefs/BriefCard'

interface PageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function BriefsPage({ searchParams }: PageProps) {
  const params = await searchParams

  const briefs = await prisma.brief.findMany({
    where: {
      deletedAt: null,
      ...(params.status && params.status !== 'all' && { status: params.status }),
    },
    include: {
      editor: true,
      script: {
        include: {
          project: true,
          format: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Assigned', value: 'assigned' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
  ]

  const currentStatus = params.status || 'all'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Briefs</h1>
        <p className="text-neutral-600">Manage and track your script briefs</p>
      </div>

      <div className="mb-6 flex gap-2 flex-wrap">
        {statusOptions.map((option) => (
          <Link key={option.value} href={option.value === 'all' ? '/briefs' : `/briefs?status=${option.value}`}>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                currentStatus === option.value
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {option.label}
            </button>
          </Link>
        ))}
      </div>

      {briefs.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              No briefs yet
            </h3>
            <p className="text-neutral-600 mb-6">
              Create a brief from a saved script to get started
            </p>
            <Link href="/scripts">
              <button className="px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-800 text-sm font-medium">
                Go to Scripts
              </button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {briefs.map((brief) => (
            <BriefCard key={brief.id} brief={brief} />
          ))}
        </div>
      )}
    </div>
  )
}
