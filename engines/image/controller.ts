/**
 * IMAGE_ENGINE - Controller
 */
import { getProjectPath, writeFiles } from "@/core/storage";

export async function generate(input: {
  prompt: string;
  userId: string;
  language?: string;
}): Promise<{ ok: boolean; projectId?: string; previewUrl?: string; error?: string }> {
  try {
    const projectId = `img_${Date.now()}`;
    const projectPath = getProjectPath("images", projectId);

    const config = {
      prompt: input.prompt,
      style_presets: ["realistic", "digital_art", "cinematic"],
      batch_count: 1,
      upscale: false,
      bg_remove: false,
    };

    writeFiles(projectPath, [
      { path: "config.json", content: JSON.stringify(config, null, 2) },
      { path: "README.md", content: `# Image generation config\n\nPrompt: ${input.prompt}\n\nConnect DALL-E/Stable Diffusion for generation.` },
    ]);

    return { ok: true, projectId, previewUrl: `/generated/images/${projectId}/config.json` };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Generation failed" };
  }
}
