/**
 * 🌐 Website / SaaS Builder Studio
 * Uses modular tool engine: Controller → AI Router → Renderer → File Generator
 */
const websiteController = require("../../lib/tools/website/controller");
const fs = require("fs");
const path = require("path");
const { GENERATED_DIR } = require("../../config/paths");

const CREDITS_PER_SITE = 10;

async function generate(userId, prompt, config = {}, userLanguage = "ar") {
  const result = await websiteController.handle({
    userId,
    prompt,
    language: userLanguage,
    layout: config.layout || "landing",
    theme: config.theme || "dark"
  });

  if (!result.ok) return result;

  const projectId = result.projectId;
  const dataDir = path.join(__dirname, "../../../data/projects");
  const dbFile = path.join(dataDir, "projects.json");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const db = fs.existsSync(dbFile) ? JSON.parse(fs.readFileSync(dbFile, "utf8")) : {};
  const title = result.output?.sections?.find(s => s.type === "hero")?.content?.title || "New Project";
  db[projectId] = {
    id: projectId,
    userId,
    name: title,
    createdAt: Date.now(),
    previewUrl: result.previewUrl,
    pages: [{ id: "home", name: "Home", sections: result.output?.sections || [] }],
    history: []
  };
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));

  return {
    ok: true,
    projectId,
    previewUrl: result.previewUrl,
    type: "website"
  };
}

module.exports = {
  generate,
  CREDITS_PER_SITE
};
