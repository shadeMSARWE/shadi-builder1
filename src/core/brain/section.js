const express = require("express");
const auth = require("../middleware/auth");
const users = require("../core/users/service");
const analyze = require("../core/brain/analyze");
const planAI = require("../core/brain/plan");
const build = require("../core/brain/htmlBuilder");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.post("/analyze", auth, async (req, res) => {
  if (!users.canGenerate(req.user.id))
    return res.status(403).json({ ok: false });

  const analysis = await analyze(req.body.description);
  const plan = await planAI(analysis);
  const html = await build(plan);

  const name = `site-${Date.now()}.html`;
  const dir = path.join(__dirname, "../generated");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), html);

  users.incrementUsage(req.user.id);

  res.json({ ok: true, previewUrl: `/generated/${name}` });
});

module.exports = router;
