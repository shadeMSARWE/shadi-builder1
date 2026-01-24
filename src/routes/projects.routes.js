const express = require("express");
const fs = require("fs");
const path = require("path");
const auth = require("../middleware/auth");

const analyze = require("../core/brain/analyze");
const planAI = require("../core/brain/plan");
const buildHTML = require("../core/brain/htmlBuilder");
const users = require("../core/users/service");

const router = express.Router();

/* =========================
   STORAGE
========================= */
const DATA_DIR = path.join(__dirname, "../../data/projects");
const GEN_DIR = path.join(__dirname, "../../generated");
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
    const html = await buildHTML(plan);

    const projectId = "site_" + Date.now();
    const projectDir = path.join(GEN_DIR, projectId);

    fs.mkdirSync(projectDir, { recursive: true });
    fs.writeFileSync(path.join(projectDir, "index.html"), html, "utf8");

    const db = readDB();
    db[projectId] = {
      id: projectId,
      userId,
      name: analysis.website_name || "New Project",
      createdAt: Date.now()
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
