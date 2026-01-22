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
    "regenerateBody",
    ()=>regenerateBody,
    "regenerateHook",
    ()=>regenerateHook,
    "repromptScript",
    ()=>repromptScript
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@anthropic-ai/sdk/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__Anthropic__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/@anthropic-ai/sdk/client.mjs [app-route] (ecmascript) <export Anthropic as default>");
;
const client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__Anthropic__as__default$3e$__["default"]({
    apiKey: process.env.ANTHROPIC_API_KEY
});
async function generateScripts({ project, format, batchInstructions }) {
    const prompt = buildPrompt(project, format, batchInstructions);
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
    return parseScriptResponse(content.text);
}
async function regenerateHook({ project, format, currentBody, batchInstructions }) {
    const examples = JSON.parse(project.examples);
    const formatExamples = format ? JSON.parse(format.examples) : [];
    const projectContext = `App: ${project.name}
Description: ${project.description}
Target Audience: ${project.targetAudience}
Tone: ${project.tone}
${examples.length > 0 ? `\nExample scripts:\n${examples.join('\n\n')}` : ''}`;
    const prompt = `You are a social media ad copywriter creating Instagram ad scripts.

App Context:
${projectContext}

${format ? `Format: ${format.structure}\nVisual Context: ${format.visualDescription}\n${formatExamples.length > 0 ? `\nFormat Example Scripts:\n${formatExamples.join('\n\n')}\n` : ''}` : ''}
${batchInstructions ? `Additional Context for this batch:\n${batchInstructions}\n` : ''}

Generate 1 unique, scroll-stopping HOOK (1-2 sentences) for an Instagram ad.

Make it different from the example hooks above.

Return ONLY the hook text, no JSON, no preamble.`;
    const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
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
    return content.text.trim();
}
async function regenerateBody({ project, format, currentHook, batchInstructions }) {
    const examples = JSON.parse(project.examples);
    const formatExamples = format ? JSON.parse(format.examples) : [];
    const projectContext = `App: ${project.name}
Description: ${project.description}
Target Audience: ${project.targetAudience}
Tone: ${project.tone}
${examples.length > 0 ? `\nExample scripts:\n${examples.join('\n\n')}` : ''}`;
    const prompt = `You are a social media ad copywriter creating Instagram ad scripts.

App Context:
${projectContext}

${format ? `Format: ${format.structure}\nVisual Context: ${format.visualDescription}\n${formatExamples.length > 0 ? `\nFormat Example Scripts:\n${formatExamples.join('\n\n')}\n` : ''}` : ''}
${batchInstructions ? `Additional Context for this batch:\n${batchInstructions}\n` : ''}

Given this HOOK:
"${currentHook}"

Generate a body script (3-4 sentences) that:
1. Flows naturally and seamlessly from the hook's tone, angle, and context
2. Explains the app and includes a call to action
3. Maintains the conversational style established by the hook
4. Creates a smooth transition so the hook and body feel like one cohesive script

The transition from hook to body should feel natural and conversational, not disjointed.

Return ONLY the body text, no JSON, no preamble.`;
    const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
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
    return content.text.trim();
}
async function repromptScript({ project, format, currentHook, currentBody, batchInstructions, repromptContext }) {
    const examples = JSON.parse(project.examples);
    const formatExamples = format ? JSON.parse(format.examples) : [];
    const projectContext = `App: ${project.name}
Description: ${project.description}
Target Audience: ${project.targetAudience}
Tone: ${project.tone}
${examples.length > 0 ? `\nExample scripts:\n${examples.join('\n\n')}` : ''}`;
    const prompt = `You are a social media ad copywriter creating Instagram ad scripts.

App Context:
${projectContext}

${format ? `Format: ${format.structure}\nVisual Context: ${format.visualDescription}\n${formatExamples.length > 0 ? `\nFormat Example Scripts:\n${formatExamples.join('\n\n')}\n` : ''}` : ''}
${batchInstructions ? `Additional Context for this batch:\n${batchInstructions}\n` : ''}

CURRENT SCRIPT:
Hook: "${currentHook}"
Body: "${currentBody}"

USER FEEDBACK/CONTEXT:
${repromptContext}

Based on the user's feedback, regenerate the ENTIRE script (both hook and body) incorporating their requested changes while maintaining:
1. Natural flow from hook to body
2. The app's tone and target audience
3. A conversational, seamless style

Return ONLY a JSON object with this structure:
{
  "hook": "regenerated hook text here",
  "body": "regenerated body text here"
}

No preamble, just the JSON object.`;
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
    try {
        const cleaned = content.text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return {
            hook: parsed.hook || '',
            body: parsed.body || ''
        };
    } catch (error) {
        console.error('Error parsing reprompt response:', error);
        console.error('Response text:', content.text);
        throw new Error('Failed to parse AI response. Please try again.');
    }
}
function buildPrompt(project, format, batchInstructions) {
    const examples = JSON.parse(project.examples);
    const formatExamples = format ? JSON.parse(format.examples) : [];
    const projectContext = `App: ${project.name}
Description: ${project.description}
Target Audience: ${project.targetAudience}
Tone: ${project.tone}
${examples.length > 0 ? `\nExample scripts:\n${examples.join('\n\n')}` : ''}`;
    return `You are a social media ad copywriter creating Instagram ad scripts.

App Context:
${projectContext}

${format ? `Format: ${format.structure}\nVisual Context: ${format.visualDescription}\n${formatExamples.length > 0 ? `\nFormat Example Scripts:\n${formatExamples.join('\n\n')}\n` : ''}` : ''}
${batchInstructions ? `Additional Context for this batch:\n${batchInstructions}\n` : ''}

Generate 10 COMPLETELY DIFFERENT ad scripts. Each script should have:
1. A unique, scroll-stopping HOOK (1-2 sentences)
2. The BODY (3-4 sentences explaining the app and call to action)

CRITICAL: The body must flow naturally from the hook. Consider the hook's tone, angle, and context when writing the body. The transition from hook to body should feel seamless and conversational, not disjointed.

Make the hooks diverse:
- Different angles appropriate for this app and audience
- Different tones that match the demographic
- Different formats (questions, statements, storytelling, reveals)

Return ONLY a JSON array with this structure:
[
  {
    "hook": "hook text here",
    "body": "body text here"
  }
]

No preamble, just the JSON array.`;
}
function parseScriptResponse(text) {
    try {
        // Clean response by removing code blocks
        const cleaned = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (!Array.isArray(parsed) || parsed.length !== 10) {
            throw new Error('Expected array of 10 scripts');
        }
        return parsed.map((item)=>({
                hook: item.hook || '',
                body: item.body || ''
            }));
    } catch (error) {
        console.error('Error parsing script response:', error);
        console.error('Response text:', text);
        throw new Error('Failed to parse AI response. Please try again.');
    }
}
}),
"[project]/app/api/reprompt-script/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
        const { projectId, formatId, currentHook, currentBody, batchInstructions, repromptContext } = body;
        // Fetch project
        const project = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].project.findUnique({
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
            format = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].scriptFormat.findUnique({
                where: {
                    id: formatId,
                    deletedAt: null
                }
            });
        }
        // Reprompt script using Claude
        const script = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$claude$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["repromptScript"])({
            project,
            format,
            currentHook,
            currentBody,
            batchInstructions,
            repromptContext
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(script);
    } catch (error) {
        console.error('Error reprompting script:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error instanceof Error ? error.message : 'Failed to reprompt script'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5f2f1503._.js.map