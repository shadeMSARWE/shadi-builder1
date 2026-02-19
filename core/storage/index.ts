/**
 * FERDOUS AI OS - Storage Core
 * File system operations for generated projects
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(process.cwd());
const GEN_BASE = path.join(ROOT, "public", "generated");
export const GENERATED = {
  websites: path.join(GEN_BASE, "websites"),
  stores: path.join(GEN_BASE, "stores"),
  saas: path.join(GEN_BASE, "saas"),
  apps: path.join(GEN_BASE, "apps"),
  games: path.join(GEN_BASE, "games"),
  videos: path.join(GEN_BASE, "videos"),
  images: path.join(GEN_BASE, "images"),
  voices: path.join(GEN_BASE, "voices"),
  social: path.join(GEN_BASE, "social"),
  advanced: path.join(GEN_BASE, "advanced"),
};

export function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function writeFile(projectPath: string, relativePath: string, content: string): void {
  const fullPath = path.join(projectPath, relativePath);
  const dir = path.dirname(fullPath);
  ensureDir(dir);
  fs.writeFileSync(fullPath, content, "utf8");
}

export function writeFiles(projectPath: string, files: Array<{ path: string; content: string }>): void {
  ensureDir(projectPath);
  for (const f of files) {
    writeFile(projectPath, f.path, f.content);
  }
}

export function getProjectPath(engine: keyof typeof GENERATED, projectId: string): string {
  const base = GENERATED[engine];
  ensureDir(base);
  return path.join(base, projectId);
}

export function projectExists(projectPath: string): boolean {
  return fs.existsSync(projectPath);
}
