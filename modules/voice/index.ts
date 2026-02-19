/**
 * FERDOUS AI - Voice Generator Module
 * TTS, voice cloning, podcast, multi-speaker
 */

import type { ModuleDefinition } from "@/core/types";

export const voiceModule: ModuleDefinition = {
  id: "voice",
  name: "AI Voice Generator",
  description: "TTS, voice cloning, podcast mode, multi-speaker",
  credits: 10,
  getPrompt: (input) => ({
    system: "Generate voice structure as JSON.",
    user: `Create voice: ${input}`,
  }),
  getSchema: () => ({}),
  generate: async () => ({ ok: false, error: "Voice module - coming soon." }),
};
