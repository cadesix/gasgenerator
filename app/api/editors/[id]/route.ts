import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// PATCH /api/editors/[id] - Update an editor
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, notes } = body

    const editor = await prisma.editor.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(notes !== undefined && { notes: notes?.trim() || null }),
      },
    })

    return NextResponse.json(editor)
  } catch (error) {
    console.error('Error updating editor:', error)
    return NextResponse.json(
      { error: 'Failed to update editor' },
      { status: 500 }
    )
  }
}

// DELETE /api/editors/[id] - Soft delete an editor
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const editor = await prisma.editor.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json(editor)
  } catch (error) {
    console.error('Error deleting editor:', error)
    return NextResponse.json(
      { error: 'Failed to delete editor' },
      { status: 500 }
    )
  }
}
