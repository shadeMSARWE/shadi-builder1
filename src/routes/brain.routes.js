const express = require("express");
const analyze = require("../core/brain/analyze");
const planAI = require("../core/brain/plan");
const buildHTML = require("../core/brain/htmlBuilder");
const fs = require("fs");
const path = require("path");

const auth = require("../middleware/auth");
const users = require("../core/users/service");

const router = express.Router();

router.post("/analyze", auth, async (req, res) => {
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

        // 2. الخطوة الأولى: تحليل الفكرة (الـ Brain العملي)
        // ملاحظة: هون السيرفر بيشتغل، والواجهة الأمامية عندك بتعرض "تحليل وصف المشروع"
        const analysis = await analyze(description);

        // 3. الخطوة الثانية: التخطيط البرمجي واختيار المكونات
        const plan = await planAI(analysis);

        // 4. الخطوة الثالثة: البناء الفعلي للكود وتنسيق الصور
        // الـ buildHTML هون هو اللي رح نخليه "فخم" في الملف الجاي
        const html = await buildHTML(plan); 

        // 5. حفظ الملف في المجلد المخصص
        const fileName = `site-${Date.now()}.html`;
        const generatedPath = path.join(__dirname, "../../generated");

        // التأكد من وجود المجلد (لزيادة الأمان)
        if (!fs.existsSync(generatedPath)) {
            fs.mkdirSync(generatedPath, { recursive: true });
        }

        const filePath = path.join(generatedPath, fileName);
        fs.writeFileSync(filePath, html, "utf8");

        // 6. تحديث عداد الاستخدام للمستخدم
        users.incrementUsage(userId);

        // 7. الرد النهائي (نفس اللي بتوقعه الـ index.html الفخم اللي عملناه)
        res.json({
            ok: true,
            previewUrl: `/generated/${fileName}`,
            downloadUrl: `/generated/${fileName}`,
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