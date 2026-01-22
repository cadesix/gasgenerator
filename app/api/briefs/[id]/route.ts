import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    // Only update fields that are provided
    const updateData: Record<string, any> = {}
    if (body.editorId !== undefined) {
      updateData.editorId = body.editorId
      // Automatically set status to "assigned" when an editor is assigned
      if (body.editorId !== null && body.status === undefined) {
        updateData.status = 'assigned'
      }
    }
    if (body.status !== undefined) updateData.status = body.status
    if (body.notes !== undefined) updateData.notes = body.notes

    const brief = await prisma.brief.update({
      where: { id },
      data: updateData,
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
    console.error('Error updating brief:', error)
    return NextResponse.json(
      { error: 'Failed to update brief' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    await prisma.brief.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting brief:', error)
    return NextResponse.json(
      { error: 'Failed to delete brief' },
      { status: 500 }
    )
  }
}
