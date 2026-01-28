import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { updates } = body as { updates: Array<{ id: string; sortOrder: number }> }

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { error: 'Updates array is required' },
        { status: 400 }
      )
    }

    // Update all scripts in a transaction
    await prisma.$transaction(
      updates.map(({ id, sortOrder }) =>
        prisma.savedScript.update({
          where: { id },
          data: { sortOrder },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering scripts:', error)
    return NextResponse.json(
      { error: 'Failed to reorder scripts' },
      { status: 500 }
    )
  }
}
