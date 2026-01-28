import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { generateScripts } from '@/lib/ai/claude'
import { Mechanism } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, formatId, batchInstructions, mechanismIds } = body

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

    // Fetch mechanisms if provided
    let mechanisms: Mechanism[] = []
    if (mechanismIds && mechanismIds.length > 0) {
      mechanisms = await prisma.mechanism.findMany({
        where: {
          id: { in: mechanismIds },
          deletedAt: null
        },
      })
    }

    // Log prompt history (dedupe by prompt text)
    if (batchInstructions && batchInstructions.trim()) {
      await prisma.promptHistory.upsert({
        where: { prompt: batchInstructions.trim() },
        update: { updatedAt: new Date() },
        create: {
          prompt: batchInstructions.trim(),
          projectId,
          formatId,
        },
      })
    }

    // Generate scripts using Claude
    const scripts = await generateScripts({
      project,
      format,
      batchInstructions,
      mechanisms,
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
