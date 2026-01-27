/**
 * FERDOUS AI Studio API
 * - Multi-output generation: image | video | social | website
 * - AI Recommendations after generation
 *
 * NOTE: This adds new routes without breaking existing backend routes.
 */
const express = require("express");
const auth = require("../middleware/auth");
const credits = require("../core/credits/service");
const enhancePrompt = require("../core/brain/enhancePrompt");
const openai = require("../utils/openai");

const router = express.Router();

// Simple pricing (extend later)
const PRICING = {
  image: 20,
  social: 10,
  website: 10
};

router.post("/enhance", auth, async (req, res) => {
  const { prompt } = req.body || {};
  const r = await enhancePrompt(prompt || "");
  if (!r.ok) return res.status(400).json(r);
  res.json({ ok: true, enhanced: r.enhanced, suggestions: r.suggestions });
});

/**
 * POST /api/v1/studio/recommend
 * Body: { outputType, prompt, meta }
 */
router.post("/recommend", auth, async (req, res) => {
  const { outputType, prompt, meta } = req.body || {};

  // If no OpenAI key → heuristic recommendations (still useful)
  if (!process.env.OPENAI_API_KEY) {
    const recos = [];
    if (outputType === "website") {
      recos.push("Your website needs a stronger CTA above the fold.");
      recos.push("Add pricing + FAQ to improve conversions.");
    } else if (outputType === "video") {
      recos.push("Improve lighting and add camera motion for higher cinematic quality.");
      recos.push("Try shorter hooks in the first 2 seconds.");
    } else if (outputType === "social") {
      recos.push("Add a stronger opening line + 3 bullet benefits.");
      recos.push("End with a clear call-to-action.");
    } else if (outputType === "image") {
      recos.push("Increase contrast and refine composition (rule of thirds).");
      recos.push("Specify camera/lens or art style for sharper results.");
    }
    return res.json({ ok: true, recommendations: recos });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an AI UX/Product expert. Provide actionable, concise recommendations after generation. Return JSON only."
        },
        {
          role: "user",
          content:
            JSON.stringify({
              outputType,
              prompt,
              meta: meta || {}
            })
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4
    });

    const raw = completion.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);
    const recommendations = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
    res.json({ ok: true, recommendations });
  } catch (e) {
    console.error("[Studio] recommend error:", e);
    res.json({
      ok: true,
      recommendations: ["Try adding more specifics (audience, tone, constraints) for better results."]
    });
  }
});

/**
 * POST /api/v1/studio/generate
 * Body: { outputType, prompt, options }
 *
 * This is a modular entrypoint; it currently delegates:
 * - website → existing /api/v1/brain via direct call is not used here; frontend can still use /brain.
 * - video → frontend uses /api/v1/videos.
 * - image/social → placeholder objects for now (extensible).
 */
router.post("/generate", auth, async (req, res) => {
  const { outputType, prompt } = req.body || {};
  if (!outputType || !prompt) return res.status(400).json({ ok: false, error: "Missing outputType/prompt" });

  if (outputType === "image" || outputType === "social") {
    const cost = PRICING[outputType] || 10;
    const userCredits = await credits.getCredits(req.user.id).catch(() => 0);
    if (userCredits < cost) return res.status(403).json({ ok: false, error: "Not enough credits", required: cost });
    const ok = await credits.deductVideoByAmount(req.user.id, cost).catch(() => false);
    if (!ok) return res.status(403).json({ ok: false, error: "Credit deduction failed", required: cost });

    return res.json({
      ok: true,
      outputType,
      cost,
      result: outputType === "social"
        ? { text: `SOCIAL POST (placeholder):\\n\\n${prompt}\\n\\n— FERDOUS AI` }
        : { imageUrl: null, note: "Image generation provider hook not connected yet." }
    });
  }

  return res.json({
    ok: false,
    error: "Use existing endpoints for website (/api/v1/brain) and video (/api/v1/videos) for now."
  });
});

module.exports = router;

