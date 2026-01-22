import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, projectId, formatId } = body

    const script = await prisma.savedScript.create({
      data: {
        title,
        content,
        projectId,
        formatId: formatId || null,
      },
    })

    return NextResponse.json(script)
  } catch (error) {
    console.error('Error saving script:', error)
    return NextResponse.json(
      { error: 'Failed to save script' },
      { status: 500 }
    )
  }
}
