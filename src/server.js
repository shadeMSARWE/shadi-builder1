require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

/* =========================
   GLOBAL MIDDLEWARES
========================= */
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, _, next) => {
  console.log(`🟢 ${req.method} ${req.originalUrl}`);
  next();
});

/* =========================
   DIRECTORIES
========================= */
const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const GENERATED_DIR = path.join(ROOT_DIR, "generated");
const PROJECTS_DIR = path.join(ROOT_DIR, "projects"); // Manus-style workspace

[GENERATED_DIR, PROJECTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

/* =========================
   STATIC FILES
========================= */
app.use(express.static(PUBLIC_DIR));
app.use("/generated", express.static(GENERATED_DIR));
app.use("/projects", express.static(PROJECTS_DIR));

/* =========================
   API ROUTES (CORE)
========================= */
app.use("/api/v1/auth", require("./routes/auth.routes"));
app.use("/api/v1/brain", require("./routes/brain.routes"));
app.use("/api/v1/projects", require("./routes/projects.routes"));
app.use("/api/v1/plans", require("./routes/plans.routes"));
app.use("/api/v1/users", require("./routes/users.routes"));

/* =========================
   PROJECT WORKSPACE API
   (Manus Logic)
========================= */

// Create project workspace
app.post("/api/v1/workspace/create", (req, res) => {
  const { projectId } = req.body;
  if (!projectId) return res.status(400).json({ ok:false });

  const dir = path.join(PROJECTS_DIR, projectId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, "history.json"),
      JSON.stringify([], null, 2)
    );
  }

  res.json({ ok:true });
});

// Save history version
app.post("/api/v1/workspace/history", (req, res) => {
  const { projectId, snapshot } = req.body;
  const file = path.join(PROJECTS_DIR, projectId, "history.json");

  if (!fs.existsSync(file)) return res.status(404).json({ ok:false });

  const history = JSON.parse(fs.readFileSync(file));
  history.unshift({
    id: Date.now(),
    snapshot,
    createdAt: new Date()
  });

  fs.writeFileSync(file, JSON.stringify(history, null, 2));
  res.json({ ok:true });
});

// Get history
app.get("/api/v1/workspace/history/:id", (req, res) => {
  const file = path.join(PROJECTS_DIR, req.params.id, "history.json");
  if (!fs.existsSync(file)) return res.json({ history:[] });

  res.json({ history: JSON.parse(fs.readFileSync(file)) });
});

/* =========================
   HEALTH CHECK
========================= */
app.get("/api/health", (_, res) => {
  res.json({
    ok: true,
    app: "Shadi AI Builder",
    mode: process.env.NODE_ENV || "development",
    time: Date.now()
  });
});

/* =========================
   FRONTEND ROUTES (MANUS STYLE)
========================= */
const page = name =>
  (_, res) => res.sendFile(path.join(PUBLIC_DIR, name));

app.get("/", page("index.html"));
app.get("/login", page("login.html"));
app.get("/generate", page("generate.html"));
app.get("/projects", page("projects.html"));
app.get("/pricing", page("pricing.html"));
app.get("/checkout", page("checkout.html"));
app.get("/success", page("success.html"));

/* =========================
   SMART 404
========================= */
app.use((req, res) => {
  if (req.path.startsWith("/api"))
    return res.status(404).json({ ok:false, error:"API Not Found" });

  res.status(404).sendFile(path.join(PUBLIC_DIR, "404.html"));
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("\n" + "🔥".repeat(32));
  console.log("🚀 SHADI AI BUILDER (MANUS MODE)");
  console.log(`🌐 ${process.env.APP_URL || "http://localhost:" + PORT}`);
  console.log("🔥".repeat(32) + "\n");
});

