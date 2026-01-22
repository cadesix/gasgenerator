'use client'

import Link from 'next/link'
import Image from 'next/image'
import { OverflowMenu, OverflowMenuItem } from '@/components/ui/OverflowMenu'

export function HeaderNav() {
  return (
    <nav className="border-b border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link
              href="/"
              className="inline-flex items-center px-1 pt-1"
            >
              <Image
                src="/images/gastank.png"
                alt="GAS"
                width={32}
                height={32}
                priority
              />
            </Link>
            <Link
              href="/scripts"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              Scripts
            </Link>
            <Link
              href="/briefs"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              Briefs
            </Link>
            <Link
              href="/editors"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              Editors
            </Link>
            <Link
              href="/ideas"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              Ideas
            </Link>
          </div>

          <div className="flex items-center">
            <OverflowMenu>
              <Link href="/projects">
                <OverflowMenuItem>Edit Apps</OverflowMenuItem>
              </Link>
              <Link href="/formats">
                <OverflowMenuItem>Edit Formats</OverflowMenuItem>
              </Link>
              <Link href="/editors-manage">
                <OverflowMenuItem>Edit Editors</OverflowMenuItem>
              </Link>
            </OverflowMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
