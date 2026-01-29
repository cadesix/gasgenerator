import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const statics = await prisma.static.findMany({
      where: { deletedAt: null },
      include: {
        project: {
          select: {
            name: true,
            icon: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(statics)
  } catch (error) {
    console.error('Error fetching statics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, prompt, referenceImages, generatedImage } = body

    if (!projectId || !generatedImage) {
      return NextResponse.json(
        { error: 'Project ID and generated image are required' },
        { status: 400 }
      )
    }

    // Get project name for title
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { name: true },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Count existing statics for this project to generate incremental title
    const existingCount = await prisma.static.count({
      where: {
        projectId,
        deletedAt: null,
      },
    })

    const title = `${project.name}-${String(existingCount + 1).padStart(2, '0')}`

    const static_ = await prisma.static.create({
      data: {
        title,
        projectId,
        prompt: prompt || null,
        referenceImages: JSON.stringify(referenceImages || []),
        generatedImage,
      },
      include: {
        project: {
          select: {
            name: true,
            icon: true,
          },
        },
      },
    })

    return NextResponse.json(static_)
  } catch (error) {
    console.error('Error saving static:', error)
    return NextResponse.json(
      { error: 'Failed to save static' },
      { status: 500 }
    )
  }
}
