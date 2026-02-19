/**
 * FERDOUS AI OS - Central File Generation Engine
 * Writes project files to generated-projects/{projectId}/
 * Supports: package.json, app/, components/, api/, styles/, README.md
 */
const fs = require("fs");
const path = require("path");
const { GENERATED_DIR } = require("../../config/paths");

function ensureDir(projectId) {
  const projectPath = path.join(GENERATED_DIR, projectId);
  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath, { recursive: true });
  }
  return projectPath;
}

function writeFile(projectId, relativePath, content) {
  const projectPath = ensureDir(projectId);
  const fullPath = path.join(projectPath, relativePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content, "utf8");
  return fullPath;
}

function writeFiles(projectId, files) {
  const written = [];
  for (const f of files || []) {
    if (f.path && f.content !== undefined) {
      writeFile(projectId, f.path, f.content);
      written.push(f.path);
    }
  }
  return written;
}

function getPreviewUrl(projectId, entry = "index.html") {
  return `/generated/${projectId}/${entry}`;
}

module.exports = {
  ensureDir,
  writeFile,
  writeFiles,
  getPreviewUrl,
  GENERATED_DIR
};
