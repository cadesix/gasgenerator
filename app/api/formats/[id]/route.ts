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
    if (body.name !== undefined) updateData.name = body.name
    if (body.structure !== undefined) updateData.structure = body.structure
    if (body.visualDescription !== undefined) updateData.visualDescription = body.visualDescription
    if (body.isGlobal !== undefined) {
      updateData.isGlobal = body.isGlobal
      updateData.projectId = body.isGlobal ? null : body.projectId || null
    } else if (body.projectId !== undefined) {
      updateData.projectId = body.projectId
    }
    if (body.examples !== undefined) updateData.examples = body.examples
    if (body.sections !== undefined) updateData.sections = body.sections

    const format = await prisma.scriptFormat.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(format)
  } catch (error) {
    console.error('Error updating format:', error)
    return NextResponse.json(
      { error: 'Failed to update format' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    await prisma.scriptFormat.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting format:', error)
    return NextResponse.json(
      { error: 'Failed to delete format' },
      { status: 500 }
    )
  }
}
