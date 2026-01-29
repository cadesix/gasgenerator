import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const static_ = await prisma.static.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        project: {
          select: {
            name: true,
            icon: true,
          },
        },
      },
    })

    if (!static_) {
      return NextResponse.json(
        { error: 'Static not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(static_)
  } catch (error) {
    console.error('Error fetching static:', error)
    return NextResponse.json(
      { error: 'Failed to fetch static' },
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

    await prisma.static.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting static:', error)
    return NextResponse.json(
      { error: 'Failed to delete static' },
      { status: 500 }
    )
  }
}
