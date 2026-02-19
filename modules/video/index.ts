/**
 * FERDOUS AI - Video Generator Module
 * Script, scenes, voiceover, music, subtitles, export
 */

import type { ModuleDefinition } from "@/core/types";

export const videoModule: ModuleDefinition = {
  id: "video",
  name: "AI Video Generator",
  description: "Generate videos with script, voiceover, music, subtitles",
  credits: 50,
  getPrompt: (input) => ({
    system: "Generate video structure as JSON.",
    user: `Create video: ${input}`,
  }),
  getSchema: () => ({}),
  generate: async () => ({ ok: false, error: "Video module - coming soon." }),
};
