/**
 * FERDOUS AI - File Generation Engine
 * Writes project files to generated-projects/{projectId}/
 * Supports: package.json, app/, components/, api/, styles/, README.md
 */

import fs from "fs";
import path from "path";
const archiver = require("archiver");

const PROJECT_ROOT = path.resolve(process.cwd());
const GENERATED_DIR = path.join(PROJECT_ROOT, "public", "generated");

export interface FileEntry {
  path: string;
  content: string;
}

export async function writeProject(
  projectId: string,
  files: FileEntry[]
): Promise<{ path: string; files: string[] }> {
  const projectPath = path.join(GENERATED_DIR, projectId);
  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath, { recursive: true });
  }

  const written: string[] = [];
  for (const f of files) {
    const fullPath = path.join(projectPath, f.path);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, f.content, "utf8");
    written.push(f.path);
  }

  return { path: projectPath, files: written };
}

export function getProjectPath(projectId: string): string {
  return path.join(GENERATED_DIR, projectId);
}

export function projectExists(projectId: string): boolean {
  return fs.existsSync(getProjectPath(projectId));
}

export async function exportZip(projectId: string): Promise<Buffer> {
  const projectPath = getProjectPath(projectId);
  if (!fs.existsSync(projectPath)) {
    throw new Error(`Project not found: ${projectId}`);
  }

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("data", (chunk: Buffer) => chunks.push(chunk));
    archive.on("end", () => resolve(Buffer.concat(chunks)));
    archive.on("error", reject);
    archive.directory(projectPath, false);
    archive.finalize();
  });
}

export const fileGenerator = {
  writeProject,
  getProjectPath,
  projectExists,
  exportZip,
  GENERATED_DIR,
};
