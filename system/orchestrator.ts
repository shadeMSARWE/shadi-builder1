/**
 * FERDOUS AI OS - Central Orchestrator
 */
import { get as getEngine } from "./registry";
import { route as routePrompt } from "./router";
import { canAfford, deductCredits, CREDIT_COSTS, logUsage } from "@/core/credits";
import { createProject } from "@/core/database";
import type { EngineId } from "./registry";

export async function orchestrate(input: {
  prompt: string;
  userId: string;
  language?: string;
  engineId?: EngineId;
}): Promise<{ ok: boolean; projectId?: string; previewUrl?: string; error?: string }> {
  const engineId = input.engineId || routePrompt(input.prompt);
  const engine = getEngine(engineId);
  if (!engine) {
    return { ok: false, error: `Engine not found: ${engineId}` };
  }

  const cost = CREDIT_COSTS[engineId as keyof typeof CREDIT_COSTS] ?? 10;
  const affordable = await canAfford(input.userId, engineId as keyof typeof CREDIT_COSTS);
  if (!affordable) {
    return { ok: false, error: "Insufficient credits", projectId: undefined };
  }

  const result = await engine.controller.generate({
    prompt: input.prompt,
    userId: input.userId,
    language: input.language || "en",
  });

  if (!result.ok) {
    return result;
  }

  await deductCredits(input.userId, cost);
  await logUsage(input.userId, engineId, cost, result.projectId || "");

  if (result.projectId && result.previewUrl) {
    await createProject({
      user_id: input.userId,
      name: input.prompt.slice(0, 100),
      type: engineId,
      project_id: result.projectId,
      preview_url: result.previewUrl,
      config: {},
    });
  }

  return result;
}
