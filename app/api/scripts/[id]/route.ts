import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Update script content
    const updateData: Record<string, any> = {}
    if (body.content !== undefined) updateData.content = body.content
    if (body.title !== undefined) updateData.title = body.title

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
