import Anthropic from '@anthropic-ai/sdk'
import { Project, ScriptFormat } from '@prisma/client'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface ScriptVariation {
  [sectionName: string]: string
}

function getSections(format?: ScriptFormat | null): string[] {
  if (!format) return ['hook', 'body']
  try {
    const sections = JSON.parse(format.sections) as string[]
    return sections.length > 0 ? sections : ['hook', 'body']
  } catch {
    return ['hook', 'body']
  }
}

export async function generateScripts({
  project,
  format,
  batchInstructions,
}: {
  project: Project
  format?: ScriptFormat | null
  batchInstructions?: string
}): Promise<ScriptVariation[]> {
  const sections = getSections(format)
  const prompt = buildPrompt(project, format, sections, batchInstructions)

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }
  return parseScriptResponse(content.text, sections)
}

export async function repromptScript({
  project,
  format,
  currentContent,
  batchInstructions,
  repromptContext,
}: {
  project: Project
  format?: ScriptFormat | null
  currentContent: Record<string, string>
  batchInstructions?: string
  repromptContext: string
}): Promise<Record<string, string>> {
  const sections = getSections(format)
  const examples = JSON.parse(project.examples) as string[]
  const formatExamples = format ? (JSON.parse(format.examples) as string[]) : []

  const projectContext = `App: ${project.name}
Description: ${project.description}
Target Audience: ${project.targetAudience}
${examples.length > 0 ? `\nExample scripts:\n${examples.join('\n\n')}` : ''}`

  const currentScriptText = sections
    .map((section) => `${section}: "${currentContent[section] || ''}"`)
    .join('\n')

  const sectionsStructure = sections.map((s) => `"${s}": "text here"`).join(',\n  ')

  const prompt = `You are a social media ad copywriter creating Instagram ad scripts.

App Context:
${projectContext}

${format ? `Format: ${format.structure}\nVisual Context: ${format.visualDescription}\n${formatExamples.length > 0 ? `\nFormat Example Scripts:\n${formatExamples.join('\n\n')}\n` : ''}` : ''}
${batchInstructions ? `Additional Context for this batch:\n${batchInstructions}\n` : ''}

CURRENT SCRIPT:
${currentScriptText}

USER FEEDBACK/CONTEXT:
${repromptContext}

Based on the user's feedback, regenerate the ENTIRE script incorporating their requested changes while maintaining:
1. Natural flow between all sections
2. The app's target audience
3. A conversational, seamless style

Return ONLY a JSON object with this structure:
{
  ${sectionsStructure}
}

No preamble, just the JSON object.`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  try {
    const cleaned = content.text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)
    return parsed
  } catch (error) {
    console.error('Error parsing reprompt response:', error)
    console.error('Response text:', content.text)
    throw new Error('Failed to parse AI response. Please try again.')
  }
}

function buildPrompt(
  project: Project,
  format: ScriptFormat | null | undefined,
  sections: string[],
  batchInstructions?: string
): string {
  const examples = JSON.parse(project.examples) as string[]
  const formatExamples = format ? (JSON.parse(format.examples) as string[]) : []

  const projectContext = `App: ${project.name}
Description: ${project.description}
Target Audience: ${project.targetAudience}
${examples.length > 0 ? `\nExample scripts:\n${examples.join('\n\n')}` : ''}`

  const sectionsDescription = sections
    .map((section, idx) => `${idx + 1}. ${section.toUpperCase()}`)
    .join('\n')

  const sectionsStructure = sections.map((s) => `"${s}": "text here"`).join(',\n    ')

  return `You are a social media ad copywriter creating Instagram ad scripts.

App Context:
${projectContext}

${format ? `Format: ${format.structure}\nVisual Context: ${format.visualDescription}\n${formatExamples.length > 0 ? `\nFormat Example Scripts:\n${formatExamples.join('\n\n')}\n` : ''}` : ''}
${batchInstructions ? `Additional Context for this batch:\n${batchInstructions}\n` : ''}

Generate 10 COMPLETELY DIFFERENT ad scripts. Each script should have these sections:
${sectionsDescription}

CRITICAL: All sections must flow naturally together. Consider each section's tone, angle, and context when writing the next. The transitions should feel seamless and conversational, not disjointed.

Make the scripts diverse:
- Different angles appropriate for this app and audience
- Different tones that match the demographic
- Different formats (questions, statements, storytelling, reveals)

Return ONLY a JSON array with this structure:
[
  {
    ${sectionsStructure}
  }
]

No preamble, just the JSON array.`
}

function parseScriptResponse(text: string, sections: string[]): ScriptVariation[] {
  try {
    // Clean response by removing code blocks
    const cleaned = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    if (!Array.isArray(parsed) || parsed.length !== 10) {
      throw new Error('Expected array of 10 scripts')
    }

    return parsed.map((item: any) => {
      const script: ScriptVariation = {}
      sections.forEach((section) => {
        script[section] = item[section] || ''
      })
      return script
    })
  } catch (error) {
    console.error('Error parsing script response:', error)
    console.error('Response text:', text)
    throw new Error('Failed to parse AI response. Please try again.')
  }
}
