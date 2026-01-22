import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { repromptScript } from '@/lib/ai/claude'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, formatId, currentContent, batchInstructions, repromptContext } = body

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

    // Reprompt script using Claude
    const content = await repromptScript({
      project,
      format,
      currentContent,
      batchInstructions,
      repromptContext,
    })

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error reprompting script:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to reprompt script' },
      { status: 500 }
    )
  }
}
