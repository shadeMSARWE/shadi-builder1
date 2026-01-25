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
 * مواصفات الفيديو المسموحة (للواجهة)
 */
router.get("/spec", (req, res) => {
  res.json({
    ok: true,
    minDurationSeconds: videos.MIN_DURATION_SEC,
    maxDurationSeconds: videos.MAX_DURATION_SEC,
    styles: videos.STYLES
  });
});

/**
 * POST /api/v1/videos
 * إنشاء طلب فيديو جديد
 * Body: { description, durationSeconds, style }
 */
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { description, durationSeconds, style } = req.body;

    const durationMin = (durationSeconds || 10) / 60;
    const cost = Math.max(credits.CREDITS_PER_VIDEO_PER_MINUTE, Math.ceil(durationMin) * credits.CREDITS_PER_VIDEO_PER_MINUTE);
    const userCredits = await credits.getCredits(userId).catch(() => 0);
    if (userCredits < cost) {
      return res.status(403).json({
        ok: false,
        error: "نقاطك غير كافية لتوليد فيديو بهذه المدة. يمكنك شراء المزيد من النقاط."
      });
    }

    const result = videos.createVideoJob(userId, {
      description: description || "",
      durationSeconds: durationSeconds || 10,
      style: style || "realistic"
    });

    if (!result.ok) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (err) {
    console.error("[Videos] create error:", err);
    res.status(500).json({ ok: false, error: "فشل إنشاء طلب الفيديو" });
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
