import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { deletedAt: null },
      include: {
        _count: {
          select: {
            formats: true,
            savedScripts: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, targetAudience, examples } = body

    const project = await prisma.project.create({
      data: {
        name,
        description,
        targetAudience,
        examples,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
