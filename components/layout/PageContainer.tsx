import { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="max-w-7xl mx-auto px-8 sm:px-24 lg:px-48 pt-16 sm:pt-20 lg:pt-24 pb-8">
      {children}
    </div>
  )
}
