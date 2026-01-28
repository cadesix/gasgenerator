import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    const prompts = await prisma.promptHistory.findMany({
      orderBy: { updatedAt: 'desc' },
      take: Math.min(limit, 50),
      select: {
        id: true,
        prompt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ prompts })
  } catch (error) {
    console.error('Error fetching prompt history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prompt history' },
      { status: 500 }
    )
  }
}
