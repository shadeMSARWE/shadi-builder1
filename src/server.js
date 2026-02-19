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
const { GENERATED_DIR, GENERATED_LEGACY } = require("./config/paths");
const PROJECTS_DIR = path.join(ROOT_DIR, "projects");

[GENERATED_DIR, PROJECTS_DIR, PUBLIC_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});
if (GENERATED_LEGACY && !fs.existsSync(GENERATED_LEGACY)) fs.mkdirSync(GENERATED_LEGACY, { recursive: true });

/* =========================
   STATIC FILES
========================= */
app.use(express.static(PUBLIC_DIR));
app.use("/generated", express.static(GENERATED_DIR));
if (GENERATED_LEGACY) app.use("/generated", express.static(GENERATED_LEGACY));
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
app.use("/api/v1/payments", require("./routes/payments.routes"));
app.use("/api/v1/videos", require("./routes/videos.routes"));
app.use("/api/v1/ferdous", require("./routes/ferdous.routes"));
app.use("/api/v1/tools", require("./routes/tools.routes"));

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
   HEALTH (Railway / production)
========================= */
app.get("/health", (_, res) => {
  res.status(200).json({
    ok: true,
    service: "ferdous-ai-os",
    ts: new Date().toISOString(),
    paypal: !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET)
  });
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

app.get("/", (req, res) => res.redirect("/dashboard.html"));
app.get("/dashboard", (_, res) => res.redirect("/dashboard.html"));
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
  console.log("\n████████████████████████");
  console.log("FERDOUS AI (فردوس)");
  console.log("The Ultimate AI Operating System");
  console.log("████████████████████████");
  console.log(`🌐 http://0.0.0.0:${PORT}`);
  console.log(`   Health: /health | PayPal: ${process.env.PAYPAL_CLIENT_ID ? "active" : "configure PAYPAL_*"}\n`);
});