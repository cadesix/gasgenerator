import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// GET /api/editors - List all editors
export async function GET() {
  try {
    const editors = await prisma.editor.findMany({
      where: { deletedAt: null },
      include: {
        _count: {
          select: {
            scripts: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(editors)
  } catch (error) {
    console.error('Error fetching editors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch editors' },
      { status: 500 }
    )
  }
}

// POST /api/editors - Create a new editor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, notes } = body

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const editor = await prisma.editor.create({
      data: {
        name: name.trim(),
        notes: notes?.trim() || null,
      },
    })

    return NextResponse.json(editor)
  } catch (error) {
    console.error('Error creating editor:', error)
    return NextResponse.json(
      { error: 'Failed to create editor' },
      { status: 500 }
    )
  }
}
