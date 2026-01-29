import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { generateImageWithNanoBanana } from '@/lib/ai/nanoBanana'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const projectId = formData.get('projectId') as string
    const prompt = formData.get('prompt') as string
    const referenceFiles = formData.getAll('referenceImages') as File[]

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    // Fetch project for context
    const project = await prisma.project.findUnique({
      where: { id: projectId, deletedAt: null },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Save reference images
    const referencePaths: string[] = []
    if (referenceFiles.length > 0) {
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'statics', 'references')
      await mkdir(uploadDir, { recursive: true })

      for (const file of referenceFiles) {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const filePath = join(uploadDir, fileName)
        await writeFile(filePath, buffer)
        referencePaths.push(`/uploads/statics/references/${fileName}`)
      }
    }

    // Call Nano-Banana to generate the image
    const generatedImagePath = await generateImageWithNanoBanana({
      prompt: prompt || '',
      appName: project.name,
      description: project.description,
      targetAudience: project.targetAudience,
      referenceImagePaths: referencePaths,
    })

    return NextResponse.json({
      generatedImage: generatedImagePath,
      referencePaths,
    })
  } catch (error) {
    console.error('Error generating static:', error)
    return NextResponse.json(
      { error: 'Failed to generate static' },
      { status: 500 }
    )
  }
}
