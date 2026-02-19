/**
 * FERDOUS AI - Game Builder Module
 * 2D, 3D, WebGL, Mobile games
 */

import type { ModuleDefinition } from "@/core/types";

export const gameModule: ModuleDefinition = {
  id: "game",
  name: "AI Game Builder",
  description: "Generate 2D/3D games with WebGL, physics, controls",
  credits: 75,
  getPrompt: (input) => ({
    system: "Generate game structure as JSON.",
    user: `Create game: ${input}`,
  }),
  getSchema: () => ({}),
  generate: async () => ({ ok: false, error: "Game module - coming soon." }),
};
