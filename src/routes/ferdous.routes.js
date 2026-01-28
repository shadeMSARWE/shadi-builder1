/**
 * FERDOUS AI - Unified Generation Route
 * 
 * ONE endpoint that understands intent and generates everything
 * Uses FERDOUS BRAIN → Orchestrator → Studios
 */
const express = require("express");
const auth = require("../middleware/auth");
const brain = require("../core/ferdous/brain");
const orchestrator = require("../core/ferdous/orchestrator");
const recommendation = require("../core/ferdous/recommendation");
const credits = require("../core/credits/service");

const router = express.Router();

/**
 * POST /api/v1/ferdous/generate
 * 
 * Body: { prompt, preset? }
 * 
 * FERDOUS BRAIN understands intent → auto-selects everything → executes
 */
router.post("/generate", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { prompt, preset } = req.body || {};
    const userLanguage = req.body.language || "ar";

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ ok: false, error: "Prompt is required" });
    }

    // Get execution plan from FERDOUS BRAIN
    let executionPlan;
    if (preset && brain.PRESETS[preset]) {
      const presetResult = brain.applyPreset(preset, prompt);
      if (presetResult && presetResult.ok) {
        executionPlan = presetResult.plan;
      }
    }

    if (!executionPlan) {
      const brainResult = await brain.understandIntent(prompt, userLanguage);
      if (!brainResult.ok) {
        return res.status(500).json({ ok: false, error: "Intent analysis failed" });
      }
      executionPlan = brainResult.plan;
    }

    // Check credits
    const userCredits = await credits.getCredits(userId).catch(() => 0);
    if (userCredits < executionPlan.estimatedCredits) {
      return res.status(403).json({
        ok: false,
        error: "Not enough credits",
        required: executionPlan.estimatedCredits,
        current: userCredits
      });
    }

    // Execute plan (multi-output orchestration)
    const result = await orchestrator.executePlan(userId, executionPlan, userLanguage);

    if (!result.ok || result.results.length === 0) {
      return res.status(500).json({
        ok: false,
        error: "Generation failed",
        errors: result.errors
      });
    }

    // Get recommendations for first output
    const firstOutput = result.results[0];
    let recommendations = null;
    try {
      const recResult = await recommendation.analyzeAndRecommend(
        firstOutput.type,
        firstOutput.previewUrl || firstOutput.projectId || "",
        prompt,
        userLanguage
      );
      if (recResult.ok) recommendations = recResult;
    } catch (err) {
      console.error("[FERDOUS] Recommendation error:", err);
    }

    res.json({
      ok: true,
      plan: executionPlan,
      results: result.results,
      recommendations: recommendations,
      totalCreditsUsed: executionPlan.estimatedCredits,
      remainingCredits: userCredits - executionPlan.estimatedCredits
    });
  } catch (err) {
    console.error("[FERDOUS] Generate error:", err);
    res.status(500).json({ ok: false, error: "Generation failed" });
  }
});

/**
 * POST /api/v1/ferdous/auto-improve
 * 
 * Body: { outputType, content, recommendations }
 * 
 * Applies high-priority recommendations automatically
 */
router.post("/auto-improve", auth, async (req, res) => {
  try {
    const { outputType, content, recommendations, language = "ar" } = req.body || {};

    if (!outputType || !content || !Array.isArray(recommendations)) {
      return res.status(400).json({ ok: false, error: "Invalid parameters" });
    }

    const result = await recommendation.autoImprove(outputType, content, recommendations, language);

    if (!result.ok) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (err) {
    console.error("[FERDOUS] Auto-improve error:", err);
    res.status(500).json({ ok: false, error: "Auto-improve failed" });
  }
});

/**
 * GET /api/v1/ferdous/presets
 * 
 * Returns available Quick Start Presets
 */
router.get("/presets", (req, res) => {
  res.json({
    ok: true,
    presets: Object.keys(brain.PRESETS).map((id) => ({
      id,
      ...brain.PRESETS[id],
      name: id.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    }))
  });
});

/**
 * GET /api/v1/ferdous/i18n/:lang
 * 
 * Returns i18n strings for frontend
 */
router.get("/i18n/:lang", (req, res) => {
  const lang = req.params.lang || "ar";
  const i18n = require("../core/i18n/service");
  const strings = i18n.getStrings(lang);
  const direction = i18n.getDirection(lang);

  res.json({
    ok: true,
    lang,
    direction,
    strings
  });
});

/**
 * POST /api/v1/ferdous/recommend
 * 
 * Get recommendations for existing project/output
 */
router.post("/recommend", auth, async (req, res) => {
  try {
    const { outputType, content, prompt, language = "ar" } = req.body || {};
    if (!outputType || !content) {
      return res.status(400).json({ ok: false, error: "outputType and content required" });
    }
    const result = await recommendation.analyzeAndRecommend(outputType, content, prompt || "", language);
    res.json(result);
  } catch (err) {
    console.error("[FERDOUS] Recommend error:", err);
    res.status(500).json({ ok: false, error: "Recommendation failed" });
  }
});

module.exports = router;
