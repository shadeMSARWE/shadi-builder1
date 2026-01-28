/**
 * 🌐 Website / SaaS Builder Studio
 * Text → Website / SaaS
 * AI decides layout: Landing, Dashboard, SaaS, E-commerce, Banking UI
 * Live Editor enabled
 */
const analyze = require("../brain/analyze");
const planAI = require("../brain/plan");
const buildHTML = require("../brain/htmlBuilder");
const fs = require("fs");
const path = require("path");
const { GENERATED_DIR } = require("../../config/paths");
const credits = require("../credits/service");

const CREDITS_PER_SITE = 10;

async function generate(userId, prompt, config = {}, userLanguage = "ar") {
  // Check credits
  const canGenerate = await credits.canGenerateSite(userId).catch(() => false);
  if (!canGenerate) {
    return { ok: false, error: "Not enough credits for website generation" };
  }

  // Analyze intent (enhanced with config from Brain)
  const analysis = await analyze(prompt);
  if (config.layout) analysis.layout = config.layout;
  if (config.theme) analysis.theme = config.theme;
  if (config.category) analysis.category = config.category;

  // Plan
  const plan = await planAI(analysis);

  // Build
  const output = await buildHTML(plan);
  const { html, css, js } = typeof output === "string" ? { html: output, css: "", js: "" } : output;

  // Save
  const projectId = Date.now().toString();
  const projectPath = path.join(GENERATED_DIR, projectId);
  if (!fs.existsSync(projectPath)) fs.mkdirSync(projectPath, { recursive: true });

  fs.writeFileSync(path.join(projectPath, "index.html"), html, "utf8");
  if (css) fs.writeFileSync(path.join(projectPath, "styles.css"), css, "utf8");
  if (js) fs.writeFileSync(path.join(projectPath, "script.js"), js, "utf8");

  // Register in projects DB
  const dataDir = path.join(__dirname, "../../../data/projects");
  const dbFile = path.join(dataDir, "projects.json");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const db = fs.existsSync(dbFile) ? JSON.parse(fs.readFileSync(dbFile, "utf8")) : {};
  db[projectId] = {
    id: projectId,
    userId,
    name: analysis.title || "New Project",
    createdAt: Date.now(),
    previewUrl: `/generated/${projectId}/index.html`,
    pages: [{ id: "home", name: "Home", sections: plan.sections || [] }],
    history: []
  };
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));

  // Deduct credits
  await credits.deductSite(userId).catch(() => {});

  return {
    ok: true,
    projectId,
    previewUrl: `/generated/${projectId}/index.html`,
    type: "website"
  };
}

module.exports = {
  generate,
  CREDITS_PER_SITE
};
