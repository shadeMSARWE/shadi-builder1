/**
 * FERDOUS AI - Social Content Engine
 * Hooks, script, caption, hashtags, thumbnail, schedule
 */

import type { ModuleDefinition } from "@/core/types";

export const socialModule: ModuleDefinition = {
  id: "social",
  name: "AI Social Content Engine",
  description: "Generate hooks, captions, hashtags, thumbnails, schedules",
  credits: 5,
  getPrompt: (input) => ({
    system: "Generate social content structure as JSON.",
    user: `Create social content: ${input}`,
  }),
  getSchema: () => ({}),
  generate: async () => ({ ok: false, error: "Social module - coming soon." }),
};
