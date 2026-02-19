/**
 * GAME_ENGINE - Controller
 */
import { getProjectPath, writeFiles } from "@/core/storage";

export async function generate(input: {
  prompt: string;
  userId: string;
  language?: string;
}): Promise<{ ok: boolean; projectId?: string; previewUrl?: string; error?: string }> {
  try {
    const projectId = `game_${Date.now()}`;
    const projectPath = getProjectPath("games", projectId);

    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>${input.prompt}</title></head>
<body style="margin:0;background:#0a0a0f;color:#fff;font-family:system-ui;display:flex;justify-content:center;align-items:center;min-height:100vh">
<canvas id="game" width="800" height="600" style="border:1px solid #333;border-radius:8px"></canvas>
<script>
const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d');
ctx.fillStyle='#1a1a2e';
ctx.fillRect(0,0,800,600);
ctx.fillStyle='#00ff88';
ctx.font='24px monospace';
ctx.fillText('FERDOUS AI - Game scaffold: ${input.prompt}',50,50);
ctx.fillText('Add physics, controls, scenes',50,90);
</script>
</body>
</html>`;

    writeFiles(projectPath, [
      { path: "index.html", content: html },
      { path: "README.md", content: `# ${input.prompt}\n\n2D/3D game scaffold. Add WebGL, physics, multiplayer.` },
    ]);

    return { ok: true, projectId, previewUrl: `/generated/games/${projectId}/index.html` };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Generation failed" };
  }
}
