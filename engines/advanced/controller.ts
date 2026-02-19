/**
 * ADVANCED - Prompt enhancer
 */
import { chatJson } from "@/core/ai";
import { getProjectPath, writeFiles } from "@/core/storage";

const SYSTEM = `Enhance the user's prompt for AI generation. Return JSON: {"enhanced":"improved prompt","suggestions":["suggestion1"]}`;

export async function generate(input: {
  prompt: string;
  userId: string;
  language?: string;
}): Promise<{ ok: boolean; projectId?: string; previewUrl?: string; error?: string }> {
  try {
    const raw = await chatJson<{ enhanced: string; suggestions: string[] }>(SYSTEM, `Enhance: ${input.prompt}`);
    const projectId = `adv_${Date.now()}`;
    const projectPath = getProjectPath("advanced", projectId);

    writeFiles(projectPath, [
      { path: "enhanced.json", content: JSON.stringify(raw, null, 2) },
    ]);

    return { ok: true, projectId, previewUrl: `/generated/advanced/${projectId}/enhanced.json` };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Generation failed" };
  }
}
