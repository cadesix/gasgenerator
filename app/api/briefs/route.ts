import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { scriptId } = body

    if (!scriptId) {
      return NextResponse.json(
        { error: 'Script ID is required' },
        { status: 400 }
      )
    }

    // Check if script exists and doesn't already have a brief
    const script = await prisma.savedScript.findUnique({
      where: { id: scriptId },
      include: { brief: true },
    })

    if (!script) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      )
    }

    if (script.brief) {
      return NextResponse.json(
        { error: 'Script already has a brief' },
        { status: 400 }
      )
    }

    // Create brief
    const brief = await prisma.brief.create({
      data: {
        scriptId,
      },
      include: {
        script: {
          include: {
            project: true,
            format: true,
          },
        },
      },
    })

    return NextResponse.json(brief)
  } catch (error) {
    console.error('Error creating brief:', error)
    return NextResponse.json(
      { error: 'Failed to create brief' },
      { status: 500 }
    )
  }
}
