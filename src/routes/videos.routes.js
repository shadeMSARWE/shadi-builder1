/**
 * واجهة نظام الفيديوهات
 * المدة: 5 ثوانٍ – 10 دقائق | الأنماط: realistic | cartoon
 */
const express = require("express");
const auth = require("../middleware/auth");
const videos = require("../core/videos/service");
const credits = require("../core/credits/service");

const router = express.Router();

/**
 * GET /api/v1/videos/spec
 * Durations: 5,10,20,30s | Styles: Realistic, Cinematic, 3D Cartoon, Anime, Digital Art
 */
router.get("/spec", (req, res) => {
  res.json({
    ok: true,
    durationsSeconds: videos.DURATIONS_SEC || [5, 10, 20, 30],
    styles: (videos.STYLE_LIST || []).length ? videos.STYLE_LIST : [
      { id: "realistic", nameEn: "Realistic", nameAr: "واقعي" },
      { id: "cinematic", nameEn: "Cinematic", nameAr: "سینمائي" },
      { id: "3d_cartoon", nameEn: "3D Cartoon", nameAr: "كرتون 3D" },
      { id: "anime", nameEn: "Anime", nameAr: "أنمي" },
      { id: "digital_art", nameEn: "Digital Art", nameAr: "فن رقمي" }
    ]
  });
});

/**
 * POST /api/v1/videos
 * Body: { description, durationSeconds, style, voiceOver }
 * Pricing by duration + style + voice-over (see config/videoPricing.js)
 */
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { description, durationSeconds, style, voiceOver } = req.body;

    const cost = (videos.getVideoCost && videos.getVideoCost(Number(durationSeconds) || 10, style || "realistic", !!voiceOver))
      || 40;
    const userCredits = await credits.getCredits(userId).catch(() => 0);
    if (userCredits < cost) {
      return res.status(403).json({
        ok: false,
        error: "Not enough credits for this video. Top up or try shorter duration / different style.",
        required: cost
      });
    }

    const result = videos.createVideoJob(userId, {
      description: description || "",
      durationSeconds: durationSeconds || 10,
      style: style || "realistic",
      voiceOver: !!voiceOver
    });

    if (!result.ok) {
      return res.status(400).json(result);
    }

    const deducted = await credits.deductVideoByAmount(userId, cost).catch(() => false);
    if (!deducted) {
      return res.status(403).json({ ok: false, error: "Credit deduction failed.", required: cost });
    }

    res.json(result);
  } catch (err) {
    console.error("[Videos] create error:", err);
    res.status(500).json({ ok: false, error: "Video creation failed" });
  }
});

/**
 * GET /api/v1/videos
 * قائمة فيديوهات المستخدم
 */
router.get("/", auth, (req, res) => {
  const list = videos.listUserVideos(req.user.id);
  res.json({ ok: true, videos: list });
});

/**
 * GET /api/v1/videos/:id
 * تفاصيل فيديو واحد
 */
router.get("/:id", auth, (req, res) => {
  const video = videos.getVideo(req.params.id, req.user.id);
  if (!video) {
    return res.status(404).json({ ok: false, error: "فيديو غير موجود" });
  }
  res.json({ ok: true, video });
});

module.exports = router;
