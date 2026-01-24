'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export function HeaderNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Create' },
    { href: '/scripts', label: 'Scripts' },
    { href: '/briefs', label: 'Briefs' },
    { href: '/editors', label: 'Editors' },
    { href: '/ideas', label: 'Ideas' },
    { href: '/settings', label: 'Settings' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="w-64 h-screen sticky top-0 border-r border-neutral-200 bg-white flex-shrink-0">
      <div className="flex flex-col h-full py-6">
        <Link href="/" className="px-6 mb-8 block">
          <img
            src="/images/gastank.png"
            alt="GAS"
            width={48}
            height={48}
            className="block"
          />
        </Link>

        <div className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'text-[#313131]'
                  : 'text-[#B3B3B3] hover:text-[#313131]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
