/**
 * FERDOUS CORE ENGINE - Central Orchestrator
 *
 * Responsibilities:
 * - Analyze user prompt
 * - Detect project type
 * - Break into structured generation plan
 * - Call appropriate sub-engine
 * - Generate structured JSON output
 * - Trigger asset generation
 * - Trigger file creation
 * - Trigger preview build
 * - Support parallel API calls, asset merging, file bundling
 */

import OpenAI from "openai";
import { moduleRegistry } from "@/modules/registry";
import type { GenerationPlan, GenerationOutput, StructuredOutput, ProjectType } from "@/core/types";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "sk-placeholder" });
}

const SYSTEM_PROMPT = `You are FERDOUS CORE, the central AI orchestrator for a production-grade AI Operating System.

Analyze the user's prompt and create a structured generation plan.

Return ONLY valid JSON:
{
  "projectType": "website|store|app|saas|game|video|image|voice|social|advanced",
  "intent": "clear description of what user wants",
  "outputs": [
    {
      "type": "string",
      "module": "website|store|app|saas|game|video|image|voice|social|advanced",
      "prompt": "enhanced prompt for this output",
      "config": {},
      "order": 1
    }
  ],
  "config": {
    "theme": "dark|light",
    "layout": "string",
    "language": "ar|en"
  },
  "estimatedCredits": number,
  "reasoning": "brief explanation"
}

Rules:
- NEVER ask the user for configuration
- ALWAYS auto-select optimal options
- Support multi-output (e.g., website + social)
- estimatedCredits: website=10, store=25, saas=50, video=50/min, image=5, voice=10
`;

export async function analyzePrompt(
  userPrompt: string,
  options: { language?: string } = {}
): Promise<{ ok: boolean; plan?: GenerationPlan; error?: string }> {
  try {
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `User prompt (${options.language || "en"}): ${userPrompt}\n\nCreate generation plan.` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const raw = completion.choices?.[0]?.message?.content || "{}";
    const plan = JSON.parse(raw) as GenerationPlan;

    if (!plan.projectType) plan.projectType = "website";
    if (!Array.isArray(plan.outputs))
      plan.outputs = [{ type: plan.projectType, module: plan.projectType, prompt: userPrompt, config: {}, order: 1 }];
    if (typeof plan.estimatedCredits !== "number") plan.estimatedCredits = 10;

    return { ok: true, plan };
  } catch (err) {
    console.error("[FERDOUS CORE] Analyze error:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Analysis failed",
    };
  }
}

export async function executePlan(
  plan: GenerationPlan,
  options: { userId: string; projectId: string; language?: string }
): Promise<{
  ok: boolean;
  results: Array<{ type: string; projectId?: string; previewUrl?: string; error?: string }>;
  errors: Array<{ module: string; error: string }>;
}> {
  const results: Array<{ type: string; projectId?: string; previewUrl?: string; error?: string }> = [];
  const errors: Array<{ module: string; error: string }> = [];

  const sortedOutputs = [...(plan.outputs || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  for (const output of sortedOutputs) {
    try {
      const module = moduleRegistry.get(output.module);
      if (!module) {
        errors.push({ module: output.module, error: `Module not found: ${output.module}` });
        continue;
      }

      const prompt = module.getPrompt(output.prompt, { ...plan.config, ...output.config });
      const completion = await getOpenAI().chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: prompt.system },
          { role: "user", content: prompt.user },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const raw = completion.choices?.[0]?.message?.content || "{}";
      const structured = JSON.parse(raw) as StructuredOutput;

      const result = await module.generate(structured, {
        userId: options.userId,
        projectId: options.projectId,
        language: options.language,
        ...output.config,
      });

      if (result.ok) {
        results.push({
          type: output.type,
          projectId: result.projectId,
          previewUrl: result.previewUrl,
        });
      } else {
        errors.push({ module: output.module, error: result.error || "Generation failed" });
      }
    } catch (err) {
      console.error(`[FERDOUS CORE] Error in ${output.module}:`, err);
      errors.push({
        module: output.module,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return {
    ok: results.length > 0,
    results,
    errors,
  };
}

export function detectProjectType(prompt: string): ProjectType {
  const p = prompt.toLowerCase();
  if (p.includes("store") || p.includes("shop") || p.includes("ecommerce") || p.includes("product")) return "store";
  if (p.includes("saas") || p.includes("dashboard") || p.includes("subscription")) return "saas";
  if (p.includes("app") || p.includes("mobile") || p.includes("react native")) return "app";
  if (p.includes("game") || p.includes("2d") || p.includes("3d")) return "game";
  if (p.includes("video") || p.includes("film")) return "video";
  if (p.includes("image") || p.includes("picture") || p.includes("photo")) return "image";
  if (p.includes("voice") || p.includes("audio") || p.includes("tts")) return "voice";
  if (p.includes("social") || p.includes("post") || p.includes("instagram") || p.includes("tiktok")) return "social";
  return "website";
}
