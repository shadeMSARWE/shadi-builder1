const express = require("express");
const fs = require("fs");
const path = require("path");
const auth = require("../middleware/auth");

const analyze = require("../core/brain/analyze");
const planAI = require("../core/brain/plan");
const buildHTML = require("../core/brain/htmlBuilder");
const users = require("../core/users/service");
const { exportZip } = require("../core/projects/service");

const { GENERATED_DIR } = require("../config/paths");
const router = express.Router();

/* =========================
   STORAGE – مسار generated موحد من config/paths
========================= */
const DATA_DIR = path.join(__dirname, "../../data/projects");
const GEN_DIR = GENERATED_DIR;
const DB_FILE = path.join(DATA_DIR, "projects.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(GEN_DIR)) fs.mkdirSync(GEN_DIR, { recursive: true });

const readDB = () =>
  fs.existsSync(DB_FILE)
    ? JSON.parse(fs.readFileSync(DB_FILE, "utf8"))
    : {};

const writeDB = (d) =>
  fs.writeFileSync(DB_FILE, JSON.stringify(d, null, 2));

/* =========================
   CREATE + BUILD PROJECT
========================= */
router.post("/analyze", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!users.canGenerate(userId)) {
      return res.status(403).json({
        ok: false,
        error: "Upgrade to PRO required"
      });
    }

    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ ok: false, error: "Description required" });
    }

    const analysis = await analyze(description);
    const plan = await planAI(analysis);
    const output = await buildHTML(plan);
    const { html, css, js } = typeof output === "string" ? { html: output, css: "", js: "" } : output;

    const projectId = "site_" + Date.now();
    const projectDir = path.join(GEN_DIR, projectId);

    fs.mkdirSync(projectDir, { recursive: true });
    fs.writeFileSync(path.join(projectDir, "index.html"), html, "utf8");
    if (css) fs.writeFileSync(path.join(projectDir, "styles.css"), css, "utf8");
    if (js) fs.writeFileSync(path.join(projectDir, "script.js"), js, "utf8");

    const db = readDB();
    db[projectId] = {
      id: projectId,
      userId,
      name: analysis.website_name || "New Project",
      createdAt: Date.now(),
      pages: [
        {
          id: "home",
          name: "Home",
          sections: ["Hero", "Features", "CTA"]
        }
      ],
      history: []
    };

    writeDB(db);

    users.incrementUsage(userId);
    users.incrementProjects(userId);

    res.json({
      ok: true,
      projectId,
      previewUrl: `/generated/${projectId}/index.html`
    });
  } catch (err) {
    console.error("PROJECT BUILD ERROR:", err);
    res.status(500).json({ ok: false, error: "Build failed" });
  }
});

/* =========================
   EXPORT SITE AS ZIP (من generated)
========================= */
router.get("/export/:id", auth, (req, res) => {
  const id = req.params.id;
  exportZip(id, res);
});

/* =========================
   LIVE EDITOR: SAVE GENERATED OUTPUT
   - Used by the Manus-clone live editor to persist edits from iframe
========================= */
router.post("/save/:id", auth, (req, res) => {
  try {
    const id = req.params.id;
    const { html, css, js } = req.body || {};

    const db = readDB();
    const project = db[id];
    if (!project || project.userId !== req.user.id) {
      return res.status(404).json({ ok: false, error: "Project not found" });
    }

    const projectDir = path.join(GEN_DIR, id);
    if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir, { recursive: true });
    if (typeof html === "string") fs.writeFileSync(path.join(projectDir, "index.html"), html, "utf8");
    if (typeof css === "string") fs.writeFileSync(path.join(projectDir, "styles.css"), css, "utf8");
    if (typeof js === "string") fs.writeFileSync(path.join(projectDir, "script.js"), js, "utf8");

    project.updatedAt = Date.now();
    writeDB(db);

    res.json({ ok: true });
  } catch (e) {
    console.error("[Projects] save error:", e);
    res.status(500).json({ ok: false, error: "Save failed" });
  }
});

/* =========================
   LIST USER PROJECTS
========================= */
router.get("/list", auth, (req, res) => {
  const db = readDB();
  const projects = Object.values(db).filter(
    (p) => p.userId === req.user.id
  );

  res.json({
    ok: true,
    projects
  });
});

/* =========================
   GET PROJECT (WORKSPACE)
========================= */
router.get("/:id", auth, (req, res) => {
  const db = readDB();
  const project = db[req.params.id];

  if (!project || project.userId !== req.user.id) {
    return res.status(404).json({ ok: false });
  }

  res.json({
    ok: true,
    id: project.id,
    name: project.name,
    pages: project.pages || [],
    history: project.history || [],
    previewUrl: `/generated/${project.id}/index.html`
  });
});

/* =========================
   REGENERATE PAGE / SECTION
========================= */
router.post("/regenerate", auth, async (req, res) => {
  const { projectId, page, section, description } = req.body;
  const db = readDB();

  const project = db[projectId];
  if (!project || project.userId !== req.user.id) {
    return res.status(404).json({ ok: false });
  }

  // 🕘 History
  project.history = project.history || [];
  project.history.unshift({
    time: Date.now(),
    page,
    section,
    description
  });

  writeDB(db);

  // 🔜 لاحقاً: AI regenerate حقيقي للـ section
  res.json({
    ok: true,
    previewUrl: `/generated/${projectId}/index.html`
  });
});

/* =========================
   DELETE PROJECT
========================= */
router.delete("/:id", auth, (req, res) => {
  const { id } = req.params;
  const db = readDB();

  if (!db[id] || db[id].userId !== req.user.id) {
    return res.status(404).json({ ok: false });
  }

  delete db[id];
  writeDB(db);

  const dir = path.join(GEN_DIR, id);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }

  res.json({ ok: true });
});

/* =========================
   UPGRADE TO PRO
========================= */
router.post("/upgrade", auth, (req, res) => {
  users.upgradeUser(req.user.id);
  res.json({ ok: true, plan: "pro" });
});

module.exports = router;
