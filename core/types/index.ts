/**
 * FERDOUS AI - Core Type Definitions
 */

export type ProjectType =
  | "website"
  | "store"
  | "app"
  | "saas"
  | "game"
  | "video"
  | "image"
  | "voice"
  | "social"
  | "advanced";

export interface GenerationPlan {
  projectType: ProjectType;
  intent: string;
  outputs: GenerationOutput[];
  config: Record<string, unknown>;
  estimatedCredits: number;
  reasoning?: string;
}

export interface GenerationOutput {
  type: string;
  module: string;
  prompt: string;
  config: Record<string, unknown>;
  order: number;
}

export interface StructuredOutput {
  type: string;
  config: Record<string, unknown>;
  sections: Section[];
  assets: Asset[];
  files: FileOutput[];
  dependencies: string[];
}

export interface Section {
  id: string;
  type: string;
  content: Record<string, unknown>;
  order: number;
}

export interface Asset {
  type: string;
  url?: string;
  alt?: string;
  content?: string;
}

export interface FileOutput {
  path: string;
  content: string;
  type: string;
}

export interface ModuleDefinition {
  id: string;
  name: string;
  description: string;
  credits: number;
  generate: (output: StructuredOutput, options: GenerationOptions) => Promise<GenerationResult>;
  getPrompt: (input: string, options: Record<string, unknown>) => { system: string; user: string };
  getSchema: () => object;
}

export interface GenerationOptions {
  userId: string;
  projectId: string;
  language?: string;
  [key: string]: unknown;
}

export interface GenerationResult {
  ok: boolean;
  projectId?: string;
  previewUrl?: string;
  files?: string[];
  error?: string;
}

export interface CreditPlan {
  id: "free" | "pro" | "enterprise";
  name: string;
  credits: number;
  price: number;
  features: string[];
}
