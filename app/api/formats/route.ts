import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const formats = await prisma.scriptFormat.findMany({
      where: { deletedAt: null },
      orderBy: [
        { isGlobal: 'desc' },
        { name: 'asc' },
      ],
    })

    return NextResponse.json(formats)
  } catch (error) {
    console.error('Error fetching formats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch formats' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, structure, visualDescription, isGlobal, projectId, examples, sections, referenceVideos, footageLinks, notes } = body

    const format = await prisma.scriptFormat.create({
      data: {
        name,
        structure,
        visualDescription,
        isGlobal,
        projectId: isGlobal ? null : projectId,
        examples: examples || '[]',
        sections: sections || '["hook","body"]',
        referenceVideos: referenceVideos || '[]',
        footageLinks: footageLinks || '[]',
        notes: notes || null,
      },
    })

    return NextResponse.json(format)
  } catch (error) {
    console.error('Error creating format:', error)
    return NextResponse.json(
      { error: 'Failed to create format' },
      { status: 500 }
    )
  }
}
