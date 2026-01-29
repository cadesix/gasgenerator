'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'

interface Static {
  id: string
  title: string
  generatedImage: string | null
  createdAt: Date
  project: {
    name: string
    icon: string | null
  }
}

interface StaticGridProps {
  statics: Static[]
}

export function StaticGrid({ statics }: StaticGridProps) {
  const router = useRouter()

  if (statics.length === 0) {
    return (
      <Card>
        <p className="text-neutral-500 text-center py-8">
          No saved statics yet. Generate your first static above!
        </p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statics.map((static_) => (
        <div
          key={static_.id}
          onClick={() => router.push(`/statics/${static_.id}`)}
          className="cursor-pointer group"
        >
          <Card padding="sm" className="transition-transform duration-200 ease-out group-hover:scale-[1.02] origin-center">
            <div className="transition-transform duration-200 ease-out group-hover:scale-[0.9804] origin-center">
              {static_.generatedImage && (
                <div className="aspect-square bg-neutral-100 rounded overflow-hidden mb-3">
                  <img
                    src={static_.generatedImage}
                    alt={static_.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 mb-1">
                {static_.project.icon && (
                  <img
                    src={static_.project.icon}
                    alt={static_.project.name}
                    className="w-4 h-4 rounded object-cover"
                  />
                )}
                <h3 className="text-sm font-semibold text-neutral-900">
                  {static_.title}
                </h3>
              </div>
              <p className="text-xs text-neutral-500">
                {new Date(static_.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}
