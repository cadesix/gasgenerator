'use client'

import { useState, useEffect } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { StaticGenerator } from '@/components/statics/StaticGenerator'
import { StaticPreview } from '@/components/statics/StaticPreview'
import { StaticGrid } from '@/components/statics/StaticGrid'

interface Project {
  id: string
  name: string
  description: string
  targetAudience: string
  icon: string | null
}

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

interface GeneratedResult {
  generatedImage: string
  referencePaths: string[]
  prompt: string
  projectId: string
}

export default function StaticsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [statics, setStatics] = useState<Static[]>([])
  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [projectsRes, staticsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/statics'),
      ])

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json()
        setProjects(projectsData)
      }

      if (staticsRes.ok) {
        const staticsData = await staticsRes.json()
        setStatics(staticsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerated = (result: GeneratedResult) => {
    setGeneratedResult(result)
  }

  const handleIterate = () => {
    // Keep the form populated, just clear the result to allow re-generation
    setGeneratedResult(null)
  }

  if (isLoading) {
    return (
      <PageContainer showBackButton={false}>
        <div className="text-center py-12">
          <p className="text-neutral-600">Loading...</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer showBackButton={false}>
      <div className="mb-8">
        <h1 className="text-[20px] font-bold text-neutral-900">Statics</h1>
      </div>

      <div className="space-y-8">
        {/* Generator Form */}
        <div>
          <StaticGenerator projects={projects} onGenerated={handleGenerated} />
        </div>

        {/* Generated Result */}
        {generatedResult && (
          <StaticPreview
            generatedImage={generatedResult.generatedImage}
            prompt={generatedResult.prompt}
            projectId={generatedResult.projectId}
            referencePaths={generatedResult.referencePaths}
            onIterate={handleIterate}
          />
        )}

        {/* Saved Statics Grid */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Saved Statics</h2>
          <StaticGrid statics={statics} />
        </div>
      </div>
    </PageContainer>
  )
}
