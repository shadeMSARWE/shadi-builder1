/**
 * SOCIAL_ENGINE - Controller
 */
import { chatJson } from "@/core/ai";
import { getProjectPath, writeFiles } from "@/core/storage";

const SYSTEM = `Generate social content as JSON:
{"hook":"string","caption":"string","hashtags":[""],"cta":"string","script":"string"}
Return ONLY valid JSON.`;

export async function generate(input: {
  prompt: string;
  userId: string;
  language?: string;
}): Promise<{ ok: boolean; projectId?: string; previewUrl?: string; error?: string }> {
  try {
    const raw = await chatJson<{ hook: string; caption: string; hashtags: string[]; cta: string; script: string }>(SYSTEM, `Create social content: ${input.prompt}`);
    const projectId = `social_${Date.now()}`;
    const projectPath = getProjectPath("social", projectId);

    writeFiles(projectPath, [
      { path: "content.json", content: JSON.stringify(raw, null, 2) },
      { path: "post.txt", content: `${raw.hook || ""}\n\n${raw.caption || ""}\n\n${(raw.hashtags || []).join(" ")}\n\n${raw.cta || ""}` },
    ]);

    return { ok: true, projectId, previewUrl: `/generated/social/${projectId}/content.json` };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Generation failed" };
  }
}
