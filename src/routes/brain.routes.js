const express = require("express");
const analyze = require("../core/brain/analyze");
const planAI = require("../core/brain/plan");
const buildHTML = require("../core/brain/htmlBuilder");
const fs = require("fs");
const path = require("path");
const { GENERATED_DIR } = require("../config/paths");

const auth = require("../middleware/auth");
const users = require("../core/users/service");
const credits = require("../core/credits/service");

const enhancePrompt = require("../core/brain/enhancePrompt");
const router = express.Router();

/**
 * POST /api/v1/brain/enhance-prompt
 * Prompt Enhancer – اقتراح تحسينات على وصف المستخدم قبل التوليد
 * Body: { description }
 */
router.post("/enhance-prompt", auth, async (req, res) => {
  try {
    const { description } = req.body || {};
    const result = await enhancePrompt(description);
    if (!result.ok) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (err) {
    console.error("[Brain] enhance-prompt error:", err);
    res.status(500).json({ ok: false, error: "فشل تحسين الوصف" });
  }
});

// الرابط المباشر للتوليد المتوافق مع generate.html
router.post("/", auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. التحقق من النقاط (Supabase) أو الحدّ القديم (محلي)
        const canByCredits = await credits.canGenerateSite(userId).catch(() => false);
        if (!canByCredits && !users.canGenerate(userId)) {
            return res.status(403).json({
                ok: false,
                error: "نقاطك غير كافية. كل موقع يستهلك 10 نقاط. اشترِ المزيد أو استخدم باقاتك المجانية."
            });
        }

        const { description } = req.body;
        if (!description) {
            return res.status(400).json({ ok: false, error: "الوصف مطلوب" });
        }

        console.log(`[FERDOUS] Starting build for User: ${userId}`);

        // 2. تحليل الفكرة
        const analysis = await analyze(description);

        // 3. التخطيط البرمجي واختيار المكونات
        const plan = await planAI(analysis);

        // 4. البناء الفعلي للكود (HTML و CSS و JS منفصلة)
        const output = await buildHTML(plan);
        const { html, css, js } = typeof output === "string" ? { html: output, css: "", js: "" } : output;

        // 5. حفظ الملفات في مجلد generated الموحد (جذر المشروع) لخدمتها عبر /generated
        const projectId = Date.now().toString();
        const projectPath = path.join(GENERATED_DIR, projectId);

        if (!fs.existsSync(projectPath)) {
            fs.mkdirSync(projectPath, { recursive: true });
        }

        fs.writeFileSync(path.join(projectPath, "index.html"), html, "utf8");
        if (css) fs.writeFileSync(path.join(projectPath, "styles.css"), css, "utf8");
        if (js) fs.writeFileSync(path.join(projectPath, "script.js"), js, "utf8");

        // 6. تسجيل المشروع في سجل المشاريع لعرضه في الـ sidebar
        const dataDir = path.join(__dirname, "../../data/projects");
        const dbFile = path.join(dataDir, "projects.json");
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        const db = fs.existsSync(dbFile) ? JSON.parse(fs.readFileSync(dbFile, "utf8")) : {};
        const projectName = analysis.title || "New Project";
        db[projectId] = {
            id: projectId,
            userId,
            name: projectName,
            createdAt: Date.now(),
            previewUrl: `/generated/${projectId}/index.html`,
            pages: [{ id: "home", name: "Home", sections: ["Hero", "Features", "CTA"] }],
            history: []
        };
        fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));

        // 7. خصم النقاط وعداد الاستخدام
        await credits.deductSite(userId).catch(() => {});
        users.incrementUsage(userId);

        res.json({
            ok: true,
            projectId: projectId,
            previewUrl: `/generated/${projectId}/index.html`,
            details: { projectName, status: "Completed" }
        });

    } catch (error) {
        console.error("🔥 Error in Brain Route:", error);
        res.status(500).json({ 
            ok: false, 
            error: "حدث خطأ أثناء معالجة الموقع. حاول مرة أخرى." 
        });
    }
});

module.exports = router;