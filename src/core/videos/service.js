/**
 * نظام الفيديوهات – هيكلية برمجية لتوليد فيديوهات من الوصف
 * المدة: من 5 ثوانٍ إلى 10 دقائق
 * الأنماط: realistic | cartoon
 *
 * الربط مع مزود فيديو (Runway / Pika / etc.) يتم لاحقاً عبر تنفيذ createVideoJob
 */
const path = require("path");
const fs = require("fs");
const { GENERATED_DIR } = require("../../config/paths");

const MIN_DURATION_SEC = 5;
const MAX_DURATION_SEC = 10 * 60; // 10 دقائق
const STYLES = ["realistic", "cartoon"];

function getGeneratedDir() {
  return GENERATED_DIR;
}

function getVideosDir() {
  const dir = path.join(getGeneratedDir(), "_videos");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/**
 * التحقق من صحة المواصفات
 */
function validateSpec(spec) {
  const duration = typeof spec.durationSeconds === "number"
    ? spec.durationSeconds
    : parseInt(spec.durationSeconds, 10);
  const style = (spec.style || "realistic").toLowerCase();
  const desc = (spec.description || "").trim();

  if (!Number.isFinite(duration) || duration < MIN_DURATION_SEC || duration > MAX_DURATION_SEC) {
    return { ok: false, error: `المدة يجب بين ${MIN_DURATION_SEC} ثانية و ${MAX_DURATION_SEC / 60} دقيقة` };
  }
  if (!STYLES.includes(style)) {
    return { ok: false, error: `النمط يجب أن يكون: ${STYLES.join(" أو ")}` };
  }
  if (!desc) {
    return { ok: false, error: "وصف الفيديو مطلوب" };
  }
  return {
    ok: true,
    durationSeconds: duration,
    style,
    description: desc
  };
}

/**
 * إنشاء طلب فيديو وحفظه في مجلد المشروع (هيكلية فقط – التنفيذ الفعلي لاحقاً)
 * يُرجع معرف الوظيفة ومسار الحفظ المتوقع
 */
function createVideoJob(userId, spec) {
  const validated = validateSpec(spec);
  if (!validated.ok) return validated;

  const videoId = `vid_${Date.now()}_${userId.slice(0, 8)}`;
  const videosDir = getVideosDir();
  const jobDir = path.join(videosDir, videoId);
  fs.mkdirSync(jobDir, { recursive: true });

  const meta = {
    id: videoId,
    userId,
    durationSeconds: validated.durationSeconds,
    style: validated.style,
    description: validated.description,
    status: "pending",
    createdAt: new Date().toISOString(),
    outputPath: null,
    previewUrl: null
  };

  fs.writeFileSync(
    path.join(jobDir, "meta.json"),
    JSON.stringify(meta, null, 2),
    "utf8"
  );
  fs.writeFileSync(
    path.join(jobDir, "prompt.txt"),
    validated.description,
    "utf8"
  );

  return {
    ok: true,
    videoId,
    status: "pending",
    durationSeconds: validated.durationSeconds,
    style: validated.style,
    previewUrl: null,
    message: "تم إنشاء طلب الفيديو. ربط المحرك (Runway/Pika) يتم لاحقاً."
  };
}

/**
 * قائمة فيديوهات مستخدم (من المجلدات فقط – لا Supabase حالياً)
 */
function listUserVideos(userId) {
  const videosDir = getVideosDir();
  if (!fs.existsSync(videosDir)) return [];
  const entries = fs.readdirSync(videosDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith("vid_") && d.name.includes(userId.slice(0, 8)));
  const list = [];
  for (const e of entries) {
    const metaPath = path.join(videosDir, e.name, "meta.json");
    if (fs.existsSync(metaPath)) {
      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
        if (meta.userId === userId) list.push(meta);
      } catch (_) {}
    }
  }
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * جلب فيديو واحد بالمعرف
 */
function getVideo(videoId, userId) {
  const videosDir = getVideosDir();
  const jobDir = path.join(videosDir, videoId);
  if (!fs.existsSync(jobDir)) return null;
  const metaPath = path.join(jobDir, "meta.json");
  if (!fs.existsSync(metaPath)) return null;
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    if (userId && meta.userId !== userId) return null;
    return meta;
  } catch (_) {
    return null;
  }
}

module.exports = {
  MIN_DURATION_SEC,
  MAX_DURATION_SEC,
  STYLES,
  getGeneratedDir,
  getVideosDir,
  validateSpec,
  createVideoJob,
  listUserVideos,
  getVideo
};
