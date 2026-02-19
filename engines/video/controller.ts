/**
 * VIDEO_AI_FACTORY - Controller
 */
import { chatJson } from "@/core/ai";
import { getProjectPath, writeFiles } from "@/core/storage";

const SYSTEM = `Generate video structure as JSON:
{"title":"string","scenes":[{"id":1,"text":"","image_prompt":"","duration":5}],"voice_language":"en","subtitles":true}
Return ONLY valid JSON.`;

export async function generate(input: {
  prompt: string;
  userId: string;
  language?: string;
}): Promise<{ ok: boolean; projectId?: string; previewUrl?: string; error?: string }> {
  try {
    const raw = await chatJson<{ title: string; scenes: Array<{ id: number; text: string; image_prompt: string; duration: number }> }>(SYSTEM, `Create video: ${input.prompt}`);
    const projectId = `video_${Date.now()}`;
    const projectPath = getProjectPath("videos", projectId);

    const scenes = raw.scenes || [{ id: 1, text: "Scene 1", image_prompt: "scene", duration: 5 }];
    let srt = "";
    let start = 0;
    for (const s of scenes) {
      const end = start + (s.duration || 5);
      srt += `${s.id}\n${formatSrtTime(start)} --> ${formatSrtTime(end)}\n${s.text}\n\n`;
      start = end;
    }

    writeFiles(projectPath, [
      { path: "script.json", content: JSON.stringify(raw, null, 2) },
      { path: "subtitles.srt", content: srt },
      { path: "README.md", content: `# ${raw.title || "Video"}\n\nScenes: ${scenes.length}. Add FFmpeg assembly for MP4 export.` },
    ]);

    return { ok: true, projectId, previewUrl: `/generated/videos/${projectId}/script.json` };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Generation failed" };
  }
}

function formatSrtTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},000`;
}
