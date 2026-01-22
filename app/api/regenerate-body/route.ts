import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { regenerateBody } from '@/lib/ai/claude'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, formatId, currentHook, batchInstructions } = body

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

    // Regenerate body using Claude
    const bodyText = await regenerateBody({
      project,
      format,
      currentHook,
      batchInstructions,
    })

    return NextResponse.json({ body: bodyText })
  } catch (error) {
    console.error('Error regenerating body:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to regenerate body' },
      { status: 500 }
    )
  }
}
