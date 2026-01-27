import Anthropic from '@anthropic-ai/sdk'
import { Project, ScriptFormat, Mechanism } from '@prisma/client'

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

function buildUnstructuredPrompt(
  project: Project,
  batchInstructions?: string,
  mechanisms: Mechanism[] = []
): string {
  const examples = JSON.parse(project.examples) as string[]

  const projectContext = `App: ${project.name}
Description: ${project.description}
Target Audience: ${project.targetAudience}
${examples.length > 0 ? `\nExample scripts:\n${examples.join('\n\n')}` : ''}`

  const mechanismsContext = mechanisms.length > 0
    ? `\n\nCopywriting Principles/Mechanisms to Apply:
${mechanisms.map(m => `### ${m.title}\n${m.content}`).join('\n\n')}\n`
    : ''

  return `You are a direct response ad copywriter creating Instagram/Facebook video ad scripts.

App Context:
${projectContext}
${mechanismsContext}
${batchInstructions ? `Additional Context:\n${batchInstructions}\n` : ''}

Generate 10 COMPLETELY DIFFERENT ad scripts. Each script should be a complete, flowing ad copy without any predefined structure or sections.

Make the scripts diverse:
- Different angles appropriate for this app and audience
- Different tones that match the demographic
- Different formats (questions, statements, storytelling, reveals)
${mechanisms.length > 0 ? '- Apply the copywriting principles/mechanisms provided above where relevant' : ''}

Return ONLY a JSON array with this structure:
[
  {
    "script": "full script text here"
  }
]

No preamble, just the JSON array.`
}

function parseUnstructuredResponse(text: string): ScriptVariation[] {
  try {
    // Clean response by removing code blocks
    const cleaned = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned) as Array<{ script: string }>

    // Convert to ScriptVariation format with single "script" field
    return parsed.map(item => ({
      script: item.script
    }))
  } catch (error) {
    console.error('Error parsing unstructured response:', error)
    console.error('Response text:', text)
    throw new Error('Failed to parse AI response. Please try again.')
  }
}

export async function generateScripts({
  project,
  format,
  batchInstructions,
  mechanisms = [],
}: {
  project: Project
  format?: ScriptFormat | null
  batchInstructions?: string
  mechanisms?: Mechanism[]
}): Promise<ScriptVariation[]> {
  // If no format is selected, use unstructured prompt
  if (!format) {
    const prompt = buildUnstructuredPrompt(project, batchInstructions, mechanisms)

    console.log('\n=== CLAUDE API CALL (UNSTRUCTURED) ===')
    console.log('Model: claude-sonnet-4-20250514')
    console.log('Max Tokens: 4000')
    console.log('\n--- PROMPT START ---')
    console.log(prompt)
    console.log('--- PROMPT END ---\n')

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

    console.log('\n--- RESPONSE START ---')
    console.log(content.text)
    console.log('--- RESPONSE END ---')
    console.log('\n=== END CLAUDE API CALL ===\n')

    return parseUnstructuredResponse(content.text)
  }

  // Format is selected, use structured prompt
  const sections = getSections(format)
  const prompt = buildPrompt(project, format, sections, batchInstructions, mechanisms)

  // Log the full prompt for debugging
  console.log('\n=== CLAUDE API CALL ===')
  console.log('Model: claude-sonnet-4-20250514')
  console.log('Max Tokens: 4000')
  console.log('\n--- PROMPT START ---')
  console.log(prompt)
  console.log('--- PROMPT END ---\n')

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

  // Log the response
  console.log('\n--- RESPONSE START ---')
  console.log(content.text)
  console.log('--- RESPONSE END ---')
  console.log('\n=== END CLAUDE API CALL ===\n')

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

  // Log the reprompt call
  console.log('\n=== CLAUDE REPROMPT API CALL ===')
  console.log('Model: claude-sonnet-4-20250514')
  console.log('Max Tokens: 2000')
  console.log('\n--- PROMPT START ---')
  console.log(prompt)
  console.log('--- PROMPT END ---\n')

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

  // Log the response
  console.log('\n--- RESPONSE START ---')
  console.log(content.text)
  console.log('--- RESPONSE END ---')
  console.log('\n=== END CLAUDE REPROMPT API CALL ===\n')

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

export async function regenerateHook({
  project,
  format,
  currentBody,
  batchInstructions,
}: {
  project: Project
  format?: ScriptFormat | null
  currentBody: string
  batchInstructions?: string
}): Promise<string> {
  const examples = JSON.parse(project.examples) as string[]
  const formatExamples = format ? (JSON.parse(format.examples) as string[]) : []

  const projectContext = `App: ${project.name}
Description: ${project.description}
Target Audience: ${project.targetAudience}
${examples.length > 0 ? `\nExample scripts:\n${examples.join('\n\n')}` : ''}`

  const prompt = `You are a direct response ad copywriter creating Instagram/Facebook video ad scripts.

App Context:
${projectContext}

${format ? `Format: ${format.structure}\nVisual Context: ${format.visualDescription}\n${formatExamples.length > 0 ? `\nFormat Example Scripts:\n${formatExamples.join('\n\n')}\n` : ''}` : ''}
${batchInstructions ? `Additional Context for this batch:\n${batchInstructions}\n` : ''}

CURRENT BODY:
${currentBody}

Generate a NEW hook that flows naturally into the existing body above. The hook should:
1. Capture attention immediately
2. Lead smoothly into the body's content
3. Match the tone and angle of the body
4. Be appropriate for the target audience

Return ONLY the hook text, nothing else.`

  console.log('\n=== CLAUDE REGENERATE HOOK API CALL ===')
  console.log('Model: claude-sonnet-4-20250514')
  console.log('Max Tokens: 500')
  console.log('\n--- PROMPT START ---')
  console.log(prompt)
  console.log('--- PROMPT END ---\n')

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
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

  console.log('\n--- RESPONSE START ---')
  console.log(content.text)
  console.log('--- RESPONSE END ---')
  console.log('\n=== END CLAUDE REGENERATE HOOK API CALL ===\n')

  return content.text.trim()
}

export async function regenerateBody({
  project,
  format,
  currentHook,
  batchInstructions,
}: {
  project: Project
  format?: ScriptFormat | null
  currentHook: string
  batchInstructions?: string
}): Promise<string> {
  const examples = JSON.parse(project.examples) as string[]
  const formatExamples = format ? (JSON.parse(format.examples) as string[]) : []

  const projectContext = `App: ${project.name}
Description: ${project.description}
Target Audience: ${project.targetAudience}
${examples.length > 0 ? `\nExample scripts:\n${examples.join('\n\n')}` : ''}`

  const prompt = `You are a direct response ad copywriter creating Instagram/Facebook video ad scripts.

App Context:
${projectContext}

${format ? `Format: ${format.structure}\nVisual Context: ${format.visualDescription}\n${formatExamples.length > 0 ? `\nFormat Example Scripts:\n${formatExamples.join('\n\n')}\n` : ''}` : ''}
${batchInstructions ? `Additional Context for this batch:\n${batchInstructions}\n` : ''}

CURRENT HOOK:
${currentHook}

Generate a NEW body that flows naturally from the hook above. The body should:
1. Continue seamlessly from where the hook leaves off
2. Deliver on the promise or curiosity created by the hook
3. Match the tone and angle established in the hook
4. Be appropriate for the target audience
5. Include a clear call-to-action

Return ONLY the body text, nothing else.`

  console.log('\n=== CLAUDE REGENERATE BODY API CALL ===')
  console.log('Model: claude-sonnet-4-20250514')
  console.log('Max Tokens: 1000')
  console.log('\n--- PROMPT START ---')
  console.log(prompt)
  console.log('--- PROMPT END ---\n')

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
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

  console.log('\n--- RESPONSE START ---')
  console.log(content.text)
  console.log('--- RESPONSE END ---')
  console.log('\n=== END CLAUDE REGENERATE BODY API CALL ===\n')

  return content.text.trim()
}

function buildPrompt(
  project: Project,
  format: ScriptFormat | null | undefined,
  sections: string[],
  batchInstructions?: string,
  mechanisms: Mechanism[] = []
): string {
  const examples = JSON.parse(project.examples) as string[]
  const formatExamples = format ? (JSON.parse(format.examples) as string[]) : []

  const projectContext = `App: ${project.name}
Description: ${project.description}
Target Audience: ${project.targetAudience}
${examples.length > 0 ? `\nExample scripts:\n${examples.join('\n\n')}` : ''}`

  const mechanismsContext = mechanisms.length > 0
    ? `\n\nCopywriting Principles/Mechanisms to Apply:
${mechanisms.map(m => `### ${m.title}\n${m.content}`).join('\n\n')}\n`
    : ''

  const sectionsDescription = sections
    .map((section, idx) => `${idx + 1}. ${section.toUpperCase()}`)
    .join('\n')

  const sectionsStructure = sections.map((s) => `"${s}": "text here"`).join(',\n    ')

  return `You are a direct response ad copywriter creating Instagram/Facebook video ad scripts.

App Context:
${projectContext}

${format ? `Format: ${format.structure}\nVisual Context: ${format.visualDescription}\n${formatExamples.length > 0 ? `\nFormat Example Scripts:\n${formatExamples.join('\n\n')}\n` : ''}` : ''}
${mechanismsContext}
${batchInstructions ? `Additional Context for this batch:\n${batchInstructions}\n` : ''}

Generate 10 COMPLETELY DIFFERENT ad scripts. Each script should have these sections:
${sectionsDescription}

CRITICAL: All sections must flow naturally together. Consider each section's tone, angle, and context when writing the next. The transitions should feel seamless and conversational, not disjointed.

Make the scripts diverse:
- Different angles appropriate for this app and audience
- Different tones that match the demographic
- Different formats (questions, statements, storytelling, reveals)
${mechanisms.length > 0 ? '- Apply the copywriting principles/mechanisms provided above where relevant' : ''}

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
