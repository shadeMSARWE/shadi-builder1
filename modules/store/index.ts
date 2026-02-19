/**
 * FERDOUS AI - Online Store Builder Module
 * Product pages, Cart, Checkout, Stripe, Admin
 */

import type { ModuleDefinition, StructuredOutput, GenerationOptions, GenerationResult } from "@/core/types";

export const storeModule: ModuleDefinition = {
  id: "store",
  name: "AI Online Store Builder",
  description: "Generate ecommerce stores with products, cart, checkout, Stripe",
  credits: 25,
  getPrompt: (input) => ({
    system: "Generate store structure as JSON. Return type, config, sections, assets, files, dependencies.",
    user: `Create online store: ${input}`,
  }),
  getSchema: () => ({}),
  generate: async (): Promise<GenerationResult> => ({
    ok: false,
    error: "Store module - coming soon. Use Website Builder for now.",
  }),
};
