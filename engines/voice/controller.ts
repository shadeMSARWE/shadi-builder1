/**
 * VOICE_ENGINE - Controller
 */
import { getProjectPath, writeFiles } from "@/core/storage";

export async function generate(input: {
  prompt: string;
  userId: string;
  language?: string;
}): Promise<{ ok: boolean; projectId?: string; previewUrl?: string; error?: string }> {
  try {
    const projectId = `voice_${Date.now()}`;
    const projectPath = getProjectPath("voices", projectId);

    writeFiles(projectPath, [
      { path: "script.txt", content: input.prompt },
      { path: "config.json", content: JSON.stringify({ mode: "tts", language: input.language || "en" }, null, 2) },
    ]);

    return { ok: true, projectId, previewUrl: `/generated/voices/${projectId}/script.txt` };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Generation failed" };
  }
}
