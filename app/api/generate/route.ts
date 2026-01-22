import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { generateScripts } from '@/lib/ai/claude'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, formatId, batchInstructions } = body

    // Fetch project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        deletedAt: null
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Fetch format if provided
    let format = null
    if (formatId) {
      format = await prisma.scriptFormat.findFirst({
        where: {
          id: formatId,
          deletedAt: null
        },
      })
    }

    // Generate scripts using Claude
    const scripts = await generateScripts({
      project,
      format,
      batchInstructions,
    })

    return NextResponse.json({ scripts })
  } catch (error) {
    console.error('Error generating scripts:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate scripts' },
      { status: 500 }
    )
  }
}
