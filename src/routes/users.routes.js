const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const users = require("../core/users/service");
const { PLANS } = require("../core/users/plans");

/* =========================
   CURRENT USER (ME)
========================= */
router.get("/me", auth, (req, res) => {
  const user = users.getUser(req.user.id);
  const plan = PLANS[user.plan] || PLANS.free;

  res.json({
    ok: true,
    id: user.id,
    email: req.user.email,
    plan: user.plan,
    usage: user.usage,
    maxUsage: plan.maxGenerations,
    projects_count: user.projects_count || 0,
    features: plan.features || []
  });
});

/* =========================
   ADMIN – LIST ALL USERS
========================= */
router.get("/admin/all", auth, (req, res) => {
  // عدّل الإيميل لإيميلك الحقيقي
  if (req.user.email !== "admin@you.com") {
    return res.status(403).json({ ok: false, error: "Not allowed" });
  }

  const allUsers = require("../../data/users.json");
  res.json({ ok: true, users: allUsers });
});

module.exports = router;
