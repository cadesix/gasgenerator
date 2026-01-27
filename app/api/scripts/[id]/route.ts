import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Update script content and workflow fields
    const updateData: Record<string, any> = {}
    if (body.content !== undefined) updateData.content = body.content
    if (body.title !== undefined) updateData.title = body.title
    if (body.editorId !== undefined) {
      updateData.editorId = body.editorId
      // Automatically set status to "assigned" when an editor is assigned
      if (body.editorId !== null && body.status === undefined) {
        updateData.status = 'assigned'
      }
    }
    if (body.status !== undefined) updateData.status = body.status
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.videoLink !== undefined) updateData.videoLink = body.videoLink

    const script = await prisma.savedScript.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(script)
  } catch (error) {
    console.error('Error updating script:', error)
    return NextResponse.json(
      { error: 'Failed to update script' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Soft delete
    await prisma.savedScript.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting script:', error)
    return NextResponse.json(
      { error: 'Failed to delete script' },
      { status: 500 }
    )
  }
}
