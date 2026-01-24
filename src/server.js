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

// تسجيل الطلبات لمراقبة الـ API في الـ Logs تبعت Railway
app.use((req, _, next) => {
  console.log(`🟢 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

/* =========================
   DIRECTORIES
========================= */
const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
/** مجلد generated في جذر المشروع – تُحفظ فيه مواقع HTML المُولَّدة ويُخدم عبر /generated */
const GENERATED_DIR = path.join(ROOT_DIR, "..", "generated");
const PROJECTS_DIR = path.join(ROOT_DIR, "projects"); 

[GENERATED_DIR, PROJECTS_DIR, PUBLIC_DIR].forEach(dir => {
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
// تأكد يا شادي إن الملفات هاي موجودة في مجلد routes
app.use("/api/v1/auth", require("./routes/auth.routes"));
app.use("/api/v1/brain", require("./routes/brain.routes"));
app.use("/api/v1/projects", require("./routes/projects.routes"));
app.use("/api/v1/plans", require("./routes/plans.routes"));
app.use("/api/v1/users", require("./routes/users.routes"));

/* =========================
   WORKSPACE API
========================= */
app.post("/api/v1/workspace/create", (req, res) => {
  const { projectId } = req.body;
  if (!projectId) return res.status(400).json({ ok: false, error: "Missing ID" });
  const dir = path.join(PROJECTS_DIR, projectId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "history.json"), JSON.stringify([], null, 2));
  }
  res.json({ ok: true });
});

/* =========================
   FRONTEND ROUTES
========================= */
const page = name => (_, res) => {
    const filePath = path.join(PUBLIC_DIR, name);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send(`File ${name} not found in public folder`);
    }
};

app.get("/", (req, res) => res.redirect("/generate.html"));
app.get("/login", page("login.html"));
app.get("/generate", page("generate.html"));

/* =========================
   SMART 404
========================= */
app.use((req, res) => {
  if (req.path.startsWith("/api"))
    return res.status(404).json({ ok: false, error: "API Not Found - Check Route Definition" });
  
  const errorPage = path.join(PUBLIC_DIR, "404.html");
  if (fs.existsSync(errorPage)) {
      res.status(404).sendFile(errorPage);
  } else {
      res.status(404).send("404 - Page Not Found");
  }
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("\n🚀 SHADI AI BUILDER IS LIVE");
  console.log(`🌐 URL: http://0.0.0.0:${PORT}\n`);
});