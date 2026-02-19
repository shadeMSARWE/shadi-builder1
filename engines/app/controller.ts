/**
 * APP_ENGINE - Controller
 */
import { getProjectPath, writeFiles } from "@/core/storage";

export async function generate(input: {
  prompt: string;
  userId: string;
  language?: string;
}): Promise<{ ok: boolean; projectId?: string; previewUrl?: string; error?: string }> {
  try {
    const projectId = `app_${Date.now()}`;
    const projectPath = getProjectPath("apps", projectId);

    const structure = `# ${input.prompt} - React Native Structure

## Folder Structure
- /src
  - /screens
  - /components
  - /navigation
  - /api
  - /hooks
- /assets
- App.tsx
- package.json

## Database Schema (Supabase)
- users (id, email, created_at)
- sessions (id, user_id, token)
`;

    writeFiles(projectPath, [
      { path: "STRUCTURE.md", content: structure },
      { path: "package.json", content: JSON.stringify({ name: "ferdous-app", scripts: { start: "expo start" } }, null, 2) },
      { path: "App.tsx", content: `// FERDOUS AI OS - App scaffold\n// Add your screens and navigation\nimport React from 'react';\nexport default function App() { return null; }` },
    ]);

    return { ok: true, projectId, previewUrl: `/generated/apps/${projectId}/STRUCTURE.md` };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Generation failed" };
  }
}
