const express = require("express");
const analyze = require("../core/brain/analyze");
const planAI = require("../core/brain/plan");
const buildHTML = require("../core/brain/htmlBuilder");
const fs = require("fs");
const path = require("path");

const auth = require("../middleware/auth");
const users = require("../core/users/service");

const router = express.Router();

// 🔥 التعديل: غيرنا المسار من /analyze إلى / ليتطابق مع طلب الصفحة generate.html
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

        // 2. الخطوة الأولى: تحليل الفكرة
        const analysis = await analyze(description);

        // 3. الخطوة الثانية: التخطيط البرمجي
        const plan = await planAI(analysis);

        // 4. الخطوة الثالثة: البناء الفعلي للكود
        const html = await buildHTML(plan); 

        // 5. حفظ الملف بتنظيم أفضل (مجلد لكل مشروع)
        const projectId = `project-${Date.now()}`;
        const generatedDir = path.join(__dirname, "../../generated");
        const projectPath = path.join(generatedDir, projectId);

        if (!fs.existsSync(projectPath)) {
            fs.mkdirSync(projectPath, { recursive: true });
        }

        const filePath = path.join(projectPath, "index.html");
        fs.writeFileSync(filePath, html, "utf8");

        // 6. تحديث عداد الاستخدام للمستخدم
        users.incrementUsage(userId);

        // 7. الرد النهائي (متوافق مع دالة gen() في الواجهة الأمامية)
        res.json({
            ok: true,
            projectId: projectId, // أضفنا هذا ليسهل التحميل والـ ZIP
            previewUrl: `/generated/${projectId}/index.html`,
            downloadUrl: `/api/v1/projects/export/${projectId}`, 
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