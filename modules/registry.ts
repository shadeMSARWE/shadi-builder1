/**
 * FERDOUS AI - Module Registry
 * Dynamic registration of generation modules. Each section is independent.
 */

import type { ModuleDefinition } from "@/core/types";

const modules = new Map<string, ModuleDefinition>();

export function register(module: ModuleDefinition): void {
  modules.set(module.id, module);
}

export function get(id: string): ModuleDefinition | undefined {
  return modules.get(id);
}

export function list(): Array<{ id: string; name: string; description: string; credits: number }> {
  return Array.from(modules.entries()).map(([id, m]) => ({
    id,
    name: m.name,
    description: m.description,
    credits: m.credits,
  }));
}

export function has(id: string): boolean {
  return modules.has(id);
}

// Auto-register modules (lazy to avoid circular deps)
let initialized = false;
export async function initModules(): Promise<void> {
  if (initialized) return;
  const loaders: Array<() => Promise<{ default?: ModuleDefinition; websiteModule?: ModuleDefinition; storeModule?: ModuleDefinition; appModule?: ModuleDefinition; saasModule?: ModuleDefinition; gameModule?: ModuleDefinition; videoModule?: ModuleDefinition; imageModule?: ModuleDefinition; voiceModule?: ModuleDefinition; socialModule?: ModuleDefinition; advancedModule?: ModuleDefinition }>> = [
    () => import("@/modules/website"),
    () => import("@/modules/store"),
    () => import("@/modules/app"),
    () => import("@/modules/saas"),
    () => import("@/modules/game"),
    () => import("@/modules/video"),
    () => import("@/modules/image"),
    () => import("@/modules/voice"),
    () => import("@/modules/social"),
    () => import("@/modules/advanced"),
  ];
  for (const load of loaders) {
    try {
      const m = await load();
      const def = m.websiteModule || m.storeModule || m.appModule || m.saasModule || m.gameModule || m.videoModule || m.imageModule || m.voiceModule || m.socialModule || m.advancedModule;
      if (def) register(def);
    } catch (e) {
      console.warn("[Registry] Module load failed:", e);
    }
  }
  const { websiteModule } = await import("@/modules/website");
  register({ ...websiteModule, id: "landing" });
  initialized = true;
}

export const moduleRegistry = {
  register,
  get,
  list,
  has,
  initModules,
};
