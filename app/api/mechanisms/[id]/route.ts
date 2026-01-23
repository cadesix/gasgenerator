import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    const updateData: Record<string, any> = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.content !== undefined) updateData.content = body.content

    const mechanism = await prisma.mechanism.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(mechanism)
  } catch (error) {
    console.error('Error updating mechanism:', error)
    return NextResponse.json(
      { error: 'Failed to update mechanism' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    await prisma.mechanism.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting mechanism:', error)
    return NextResponse.json(
      { error: 'Failed to delete mechanism' },
      { status: 500 }
    )
  }
}
