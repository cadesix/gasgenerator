import { GoogleGenAI } from '@google/genai'
import { writeFile, mkdir, readFile } from 'fs/promises'
import { join } from 'path'

interface GenerateImageParams {
  prompt: string
  appName: string
  description: string
  targetAudience: string
  referenceImagePaths?: string[]
}

export async function generateImageWithNanoBanana(
  params: GenerateImageParams
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set')
  }

  const ai = new GoogleGenAI({ apiKey })

  // Build the full prompt with app context
  const fullPrompt = `
Create a static ad image for the following app:

App: ${params.appName}
Description: ${params.description}
Target Audience: ${params.targetAudience}

User Instructions: ${params.prompt}

Generate a professional, eye-catching static ad that captures the app's essence and appeals to the target audience.
`.trim()

  // Prepare content parts
  const contentParts: any[] = [{ text: fullPrompt }]

  // Add reference images if provided
  if (params.referenceImagePaths && params.referenceImagePaths.length > 0) {
    for (const imagePath of params.referenceImagePaths) {
      try {
        // Read image file from public directory
        const fullPath = join(process.cwd(), 'public', imagePath)
        const imageBuffer = await readFile(fullPath)
        const base64Data = imageBuffer.toString('base64')

        // Determine mime type from file extension
        const ext = imagePath.split('.').pop()?.toLowerCase()
        let mimeType = 'image/jpeg'
        if (ext === 'png') mimeType = 'image/png'
        else if (ext === 'gif') mimeType = 'image/gif'
        else if (ext === 'webp') mimeType = 'image/webp'

        contentParts.push({
          inlineData: {
            mimeType,
            data: base64Data,
          },
        })
      } catch (error) {
        console.error(`Error reading reference image ${imagePath}:`, error)
        // Continue with other images
      }
    }
  }

  // Generate content using new API
  const result = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [{ role: 'user', parts: contentParts }],
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
      imageConfig: {
        aspectRatio: '1:1',
        imageSize: '2K',
      },
    },
  })

  // Log the response structure for debugging
  console.log('Full result:', JSON.stringify(result, null, 2))

  // The response structure is different in the new SDK
  let imageData: string | null = null

  // Try to find image data in the response
  if (result.candidates && result.candidates.length > 0) {
    const candidate = result.candidates[0]
    if (candidate.content && candidate.content.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.data) {
          imageData = part.inlineData.data
          break
        }
      }
    }
  }

  if (!imageData) {
    console.error('No image data found in response')
    throw new Error('No image data in response')
  }

  // Save the generated image
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'statics', 'generated')
  await mkdir(uploadDir, { recursive: true })

  const fileName = `${Date.now()}-nano-banana.png`
  const filePath = join(uploadDir, fileName)

  // Decode base64 and save
  const imageBuffer = Buffer.from(imageData, 'base64')
  await writeFile(filePath, imageBuffer)

  return `/uploads/statics/generated/${fileName}`
}
