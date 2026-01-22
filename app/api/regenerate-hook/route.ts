import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { regenerateHook } from '@/lib/ai/claude'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, formatId, currentBody, batchInstructions } = body

    // Fetch project
    const project = await prisma.project.findUnique({
      where: { id: projectId, deletedAt: null },
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
      format = await prisma.scriptFormat.findUnique({
        where: { id: formatId, deletedAt: null },
      })
    }

    // Regenerate hook using Claude
    const hook = await regenerateHook({
      project,
      format,
      currentBody,
      batchInstructions,
    })

    return NextResponse.json({ hook })
  } catch (error) {
    console.error('Error regenerating hook:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to regenerate hook' },
      { status: 500 }
    )
  }
}
