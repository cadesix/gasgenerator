module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/db/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]();
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[project]/lib/ai/claude.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateScripts",
    ()=>generateScripts,
    "repromptScript",
    ()=>repromptScript
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@anthropic-ai/sdk/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__Anthropic__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/@anthropic-ai/sdk/client.mjs [app-route] (ecmascript) <export Anthropic as default>");
;
const client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__Anthropic__as__default$3e$__["default"]({
    apiKey: process.env.ANTHROPIC_API_KEY
});
function getSections(format) {
    if (!format) return [
        'hook',
        'body'
    ];
    try {
        const sections = JSON.parse(format.sections);
        return sections.length > 0 ? sections : [
            'hook',
            'body'
        ];
    } catch  {
        return [
            'hook',
            'body'
        ];
    }
}
async function generateScripts({ project, format, batchInstructions, mechanisms = [] }) {
    const sections = getSections(format);
    const prompt = buildPrompt(project, format, sections, batchInstructions, mechanisms);
    // Log the full prompt for debugging
    console.log('\n=== CLAUDE API CALL ===');
    console.log('Model: claude-sonnet-4-20250514');
    console.log('Max Tokens: 4000');
    console.log('\n--- PROMPT START ---');
    console.log(prompt);
    console.log('--- PROMPT END ---\n');
    const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ]
    });
    const content = response.content[0];
    if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
    }
    // Log the response
    console.log('\n--- RESPONSE START ---');
    console.log(content.text);
    console.log('--- RESPONSE END ---');
    console.log('\n=== END CLAUDE API CALL ===\n');
    return parseScriptResponse(content.text, sections);
}
async function repromptScript({ project, format, currentContent, batchInstructions, repromptContext }) {
    const sections = getSections(format);
    const examples = JSON.parse(project.examples);
    const formatExamples = format ? JSON.parse(format.examples) : [];
    const projectContext = `App: ${project.name}
Description: ${project.description}
Target Audience: ${project.targetAudience}
${examples.length > 0 ? `\nExample scripts:\n${examples.join('\n\n')}` : ''}`;
    const currentScriptText = sections.map((section)=>`${section}: "${currentContent[section] || ''}"`).join('\n');
    const sectionsStructure = sections.map((s)=>`"${s}": "text here"`).join(',\n  ');
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

No preamble, just the JSON object.`;
    // Log the reprompt call
    console.log('\n=== CLAUDE REPROMPT API CALL ===');
    console.log('Model: claude-sonnet-4-20250514');
    console.log('Max Tokens: 2000');
    console.log('\n--- PROMPT START ---');
    console.log(prompt);
    console.log('--- PROMPT END ---\n');
    const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ]
    });
    const content = response.content[0];
    if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
    }
    // Log the response
    console.log('\n--- RESPONSE START ---');
    console.log(content.text);
    console.log('--- RESPONSE END ---');
    console.log('\n=== END CLAUDE REPROMPT API CALL ===\n');
    try {
        const cleaned = content.text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return parsed;
    } catch (error) {
        console.error('Error parsing reprompt response:', error);
        console.error('Response text:', content.text);
        throw new Error('Failed to parse AI response. Please try again.');
    }
}
function buildPrompt(project, format, sections, batchInstructions, mechanisms = []) {
    const examples = JSON.parse(project.examples);
    const formatExamples = format ? JSON.parse(format.examples) : [];
    const projectContext = `App: ${project.name}
Description: ${project.description}
Target Audience: ${project.targetAudience}
${examples.length > 0 ? `\nExample scripts:\n${examples.join('\n\n')}` : ''}`;
    const mechanismsContext = mechanisms.length > 0 ? `\n\nCopywriting Principles/Mechanisms to Apply:
${mechanisms.map((m)=>`### ${m.title}\n${m.content}`).join('\n\n')}\n` : '';
    const sectionsDescription = sections.map((section, idx)=>`${idx + 1}. ${section.toUpperCase()}`).join('\n');
    const sectionsStructure = sections.map((s)=>`"${s}": "text here"`).join(',\n    ');
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

No preamble, just the JSON array.`;
}
function parseScriptResponse(text, sections) {
    try {
        // Clean response by removing code blocks
        const cleaned = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (!Array.isArray(parsed) || parsed.length !== 10) {
            throw new Error('Expected array of 10 scripts');
        }
        return parsed.map((item)=>{
            const script = {};
            sections.forEach((section)=>{
                script[section] = item[section] || '';
            });
            return script;
        });
    } catch (error) {
        console.error('Error parsing script response:', error);
        console.error('Response text:', text);
        throw new Error('Failed to parse AI response. Please try again.');
    }
}
}),
"[project]/app/api/generate/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$claude$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai/claude.ts [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    try {
        const body = await request.json();
        const { projectId, formatId, batchInstructions, mechanismIds } = body;
        // Fetch project
        const project = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].project.findFirst({
            where: {
                id: projectId,
                deletedAt: null
            }
        });
        if (!project) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Project not found'
            }, {
                status: 404
            });
        }
        // Fetch format if provided
        let format = null;
        if (formatId) {
            format = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].scriptFormat.findFirst({
                where: {
                    id: formatId,
                    deletedAt: null
                }
            });
        }
        // Fetch mechanisms if provided
        let mechanisms = [];
        if (mechanismIds && mechanismIds.length > 0) {
            mechanisms = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].mechanism.findMany({
                where: {
                    id: {
                        in: mechanismIds
                    },
                    deletedAt: null
                }
            });
        }
        // Generate scripts using Claude
        const scripts = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$claude$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateScripts"])({
            project,
            format,
            batchInstructions,
            mechanisms
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            scripts
        });
    } catch (error) {
        console.error('Error generating scripts:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error instanceof Error ? error.message : 'Failed to generate scripts'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3fc841df._.js.map