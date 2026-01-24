const express = require("express");
const analyze = require("../core/brain/analyze");
const planAI = require("../core/brain/plan");
const buildHTML = require("../core/brain/htmlBuilder");
const fs = require("fs");
const path = require("path");

const auth = require("../middleware/auth");
const users = require("../core/users/service");

const router = express.Router();

// الرابط المباشر للتوليد المتوافق مع generate.html
router.post("/", auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. التحقق من الصلاحيات (نظام الخطط)
        if (!users.canGenerate(userId)) {
            return res.status(403).json({
                ok: false,
                error: "وصلت للحد الأقصى للخطة المجانية. يرجى الترقية لـ PRO"
            });
        }

        const { description } = req.body;
        if (!description) {
            return res.status(400).json({ ok: false, error: "الوصف مطلوب" });
        }

        console.log(`[Shadi-AI] Starting build for User: ${userId}`);

        // 2. تحليل الفكرة
        const analysis = await analyze(description);

        // 3. التخطيط البرمجي واختيار المكونات
        const plan = await planAI(analysis);

        // 4. البناء الفعلي للكود
        const html = await buildHTML(plan); 

        // 5. حفظ الملف في مجلد generated (جذر المشروع) لخدمته عبر /generated
        const projectId = Date.now().toString();
        const projectPath = path.join(__dirname, "../../generated", projectId);

        if (!fs.existsSync(projectPath)) {
            fs.mkdirSync(projectPath, { recursive: true });
        }

        const filePath = path.join(projectPath, "index.html");
        fs.writeFileSync(filePath, html, "utf8");

        // 6. تحديث عداد الاستخدام للمستخدم
        users.incrementUsage(userId);

        // 7. الرد النهائي (المسارات الآن صحيحة 100% للعرض)
        res.json({
            ok: true,
            projectId: projectId,
            previewUrl: `/generated/${projectId}/index.html`,
            details: {
                projectName: analysis.title || "New Project",
                status: "Completed"
            }
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