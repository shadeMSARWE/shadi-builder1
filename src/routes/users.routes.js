const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const users = require("../core/users/service");
const { PLANS } = require("../core/users/plans");
const credits = require("../core/credits/service");
const fs = require("fs");
const path = require("path");

/* =========================
   CURRENT USER (ME) – نظام النقاط من Supabase
========================= */
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await credits.ensureProfile(req.user.id);
    const plan = PLANS[profile.plan] || PLANS.free;
    const localUser = users.getUser(req.user.id);

    res.json({
      ok: true,
      id: req.user.id,
      email: req.user.email,
      plan: profile.plan,
      credits: profile.credits,
      creditsPerSite: credits.CREDITS_PER_SITE,
      usage: localUser.usage,
      maxUsage: plan.maxGenerations,
      projects_count: localUser.projects_count || 0,
      features: plan.features || []
    });
  } catch (e) {
    const user = users.getUser(req.user.id);
    const plan = PLANS[user.plan] || PLANS.free;
    res.json({
      ok: true,
      id: user.id,
      email: req.user.email,
      plan: user.plan,
      credits: null,
      usage: user.usage,
      maxUsage: plan.maxGenerations,
      projects_count: user.projects_count || 0,
      features: plan.features || []
    });
  }
});

/* =========================
   ADMIN – LIST ALL USERS
   (PROTECTED)
========================= */
router.get("/admin/all", auth, (req, res) => {
  // 🔐 حماية حقيقية (مش hardcoded)
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  if (!ADMIN_EMAIL || req.user.email !== ADMIN_EMAIL) {
    return res.status(403).json({ ok: false, error: "Not allowed" });
  }

  const file = path.join(__dirname, "../../data/users.json");
  if (!fs.existsSync(file)) {
    return res.json({ ok: true, users: {} });
  }

  const allUsers = JSON.parse(fs.readFileSync(file, "utf8"));
  res.json({ ok: true, users: allUsers });
});

module.exports = router;
