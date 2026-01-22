import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, type, projectId } = body

    const idea = await prisma.idea.create({
      data: {
        content,
        type,
        projectId: projectId || null,
      },
    })

    return NextResponse.json(idea)
  } catch (error) {
    console.error('Error creating idea:', error)
    return NextResponse.json(
      { error: 'Failed to create idea' },
      { status: 500 }
    )
  }
}
