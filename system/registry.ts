/**
 * FERDOUS AI OS - Engine Registry
 */
export type EngineId = "website" | "store" | "saas" | "app" | "game" | "video" | "image" | "voice" | "social" | "advanced";

export interface EngineDefinition {
  id: EngineId;
  name: string;
  credits: number;
  controller: {
    generate: (input: { prompt: string; userId: string; language?: string; options?: Record<string, unknown> }) => Promise<GenerationResult>;
  };
}

export interface GenerationResult {
  ok: boolean;
  projectId?: string;
  previewUrl?: string;
  error?: string;
}

const engines = new Map<EngineId, EngineDefinition>();

export function register(engine: EngineDefinition): void {
  engines.set(engine.id, engine);
}

export function get(id: EngineId): EngineDefinition | undefined {
  return engines.get(id);
}

export function list(): EngineDefinition[] {
  return Array.from(engines.values());
}
