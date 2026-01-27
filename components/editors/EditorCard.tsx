'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Editor } from '@prisma/client'

interface EditorCardProps {
  editor: Editor & {
    _count: {
      scripts: number
    }
  }
}

export function EditorCard({ editor }: EditorCardProps) {
  const router = useRouter()

  return (
    <Link href={`/editors/${editor.id}`} className="group">
      <Card className="cursor-pointer h-full transition-transform duration-200 ease-out group-hover:scale-[1.02] origin-center">
        <div className="transition-transform duration-200 ease-out group-hover:scale-[0.9804] origin-center">
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-neutral-900">
              {editor.name}
            </h3>
            {editor._count.scripts > 0 && (
              <p className="text-sm text-neutral-500 mt-1">
                {editor._count.scripts} {editor._count.scripts === 1 ? 'script' : 'scripts'}
              </p>
            )}
          </div>

          {editor.notes && (
            <div className="mt-3 pt-3 border-t border-neutral-200">
              <p className="text-sm text-neutral-700 whitespace-pre-wrap line-clamp-4">
                {editor.notes}
              </p>
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
