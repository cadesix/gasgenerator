import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const content = formData.get('content') as string
    const type = formData.get('type') as string
    const projectId = formData.get('projectId') as string
    const imageFiles = formData.getAll('images') as File[]

    const imagePaths: string[] = []

    if (imageFiles.length > 0) {
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'ideas')
      await mkdir(uploadDir, { recursive: true })

      for (const file of imageFiles) {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const filePath = join(uploadDir, fileName)
        await writeFile(filePath, buffer)
        imagePaths.push(`/uploads/ideas/${fileName}`)
      }
    }

    const idea = await prisma.idea.create({
      data: {
        content,
        type,
        projectId: projectId || null,
        images: JSON.stringify(imagePaths),
      },
    })

    return NextResponse.json(idea)
  } catch (error) {
    console.error('Error creating idea:', error)
    return NextResponse.json(
      { error: 'Failed to create idea' },
      { status: 500 }
    )
  }
}
