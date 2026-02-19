/**
 * FERDOUS AI OS - Tools API
 * Modular tool engine endpoints
 */
const express = require("express");
const fs = require("fs");
const path = require("path");
const auth = require("../middleware/auth");
const toolRegistry = require("../lib/tools/registry");
const websiteController = require("../lib/tools/website/controller");

const router = express.Router();
const DATA_DIR = path.join(__dirname, "../../data/projects");
const DB_FILE = path.join(DATA_DIR, "projects.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function registerProject(projectId, userId, name, previewUrl, sections) {
  ensureDataDir();
  const db = fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE, "utf8")) : {};
  db[projectId] = {
    id: projectId,
    userId,
    name: name || "New Project",
    createdAt: Date.now(),
    previewUrl,
    pages: [{ id: "home", name: "Home", sections: sections || [] }],
    history: []
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

/**
 * GET /api/v1/tools
 * List all registered tools
 */
router.get("/", (req, res) => {
  res.json({
    ok: true,
    tools: toolRegistry.list()
  });
});

/**
 * POST /api/v1/tools/website/generate
 * Generate website via modular tool engine
 */
router.post("/website/generate", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { prompt, language = "ar", layout, theme } = req.body || {};

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ ok: false, error: "Prompt is required" });
    }

    const result = await websiteController.handle({
      userId,
      prompt: prompt.trim(),
      language,
      layout: layout || "landing",
      theme: theme || "dark"
    });

    if (!result.ok) {
      return res.status(result.statusCode || 400).json(result);
    }

    const title = result.output?.sections?.find(s => s.type === "hero")?.content?.title || "New Project";
    registerProject(result.projectId, userId, title, result.previewUrl, result.output?.sections);

    res.json({
      ok: true,
      projectId: result.projectId,
      previewUrl: result.previewUrl,
      type: result.type
    });
  } catch (err) {
    console.error("[Tools] Website generate error:", err);
    res.status(500).json({ ok: false, error: "Generation failed" });
  }
});

module.exports = router;
