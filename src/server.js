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
   FOLDERS
========================= */
const PUBLIC_DIR = path.join(__dirname, "public");
const GENERATED_DIR = path.join(__dirname, "generated");

if (!fs.existsSync(GENERATED_DIR)) {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

/* =========================
   STATIC FILES
========================= */
app.use(express.static(PUBLIC_DIR));
app.use("/generated", express.static(GENERATED_DIR));

/* =========================
   API ROUTES
========================= */
app.use("/api/v1/auth", require("./routes/auth.routes"));
app.use("/api/v1/brain", require("./routes/brain.routes"));
app.use("/api/v1/projects", require("./routes/projects.routes"));
app.use("/api/v1/plans", require("./routes/plans.routes"));
app.use("/api/v1/users", require("./routes/users.routes"));

/* =========================
   HEALTH CHECK
========================= */
app.get("/api/health", (_, res) => {
  res.json({
    ok: true,
    name: "Shadi AI Builder",
    env: process.env.NODE_ENV || "development",
    time: Date.now()
  });
});

/* =========================
   FRONTEND ROUTES
========================= */
app.get("/", (_, res) =>
  res.sendFile(path.join(PUBLIC_DIR, "index.html"))
);

app.get("/login", (_, res) =>
  res.sendFile(path.join(PUBLIC_DIR, "login.html"))
);

app.get("/dashboard", (_, res) =>
  res.sendFile(path.join(PUBLIC_DIR, "dashboard.html"))
);

app.get("/projects", (_, res) =>
  res.sendFile(path.join(PUBLIC_DIR, "projects.html"))
);

app.get("/pricing", (_, res) =>
  res.sendFile(path.join(PUBLIC_DIR, "pricing.html"))
);

app.get("/checkout", (_, res) =>
  res.sendFile(path.join(PUBLIC_DIR, "checkout.html"))
);

app.get("/success", (_, res) =>
  res.sendFile(path.join(PUBLIC_DIR, "success.html"))
);

/* =========================
   404 HANDLER (SMART)
========================= */
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({
      ok: false,
      error: "API route not found"
    });
  }

  res.status(404).sendFile(
    path.join(PUBLIC_DIR, "404.html")
  );
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("\n" + "⭐".repeat(32));
  console.log("🚀 SHADI AI BUILDER READY");
  console.log(`🌐 Server running on port ${PORT}`);
  console.log("⭐".repeat(32) + "\n");
});
