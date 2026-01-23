import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const mechanisms = await prisma.mechanism.findMany({
      where: { deletedAt: null },
      orderBy: { title: 'asc' },
    })

    return NextResponse.json(mechanisms)
  } catch (error) {
    console.error('Error fetching mechanisms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mechanisms' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content } = body

    const mechanism = await prisma.mechanism.create({
      data: {
        title,
        content,
      },
    })

    return NextResponse.json(mechanism)
  } catch (error) {
    console.error('Error creating mechanism:', error)
    return NextResponse.json(
      { error: 'Failed to create mechanism' },
      { status: 500 }
    )
  }
}
