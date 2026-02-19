/**
 * WEBSITE_ENGINE_PRO - Controller
 */
import { chatJson } from "@/core/ai";
import { getProjectPath } from "@/core/storage";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompts";
import { validateWebsiteStructure } from "./schema";
import { generateWebsiteFiles } from "./file-generator";

export async function generate(input: {
  prompt: string;
  userId: string;
  language?: string;
}): Promise<{ ok: boolean; projectId?: string; previewUrl?: string; error?: string }> {
  try {
    const lang = input.language || "en";
    const raw = await chatJson<unknown>(SYSTEM_PROMPT, buildUserPrompt(input.prompt, lang));
    const struct = validateWebsiteStructure(raw);

    const projectId = `web_${Date.now()}`;
    const projectPath = getProjectPath("websites", projectId);
    generateWebsiteFiles(projectPath, struct);

    const previewUrl = `/generated/websites/${projectId}/index.html`;
    return { ok: true, projectId, previewUrl };
  } catch (err) {
    console.error("[WebsiteEngine] Error:", err);
    return { ok: false, error: err instanceof Error ? err.message : "Generation failed" };
  }
}
