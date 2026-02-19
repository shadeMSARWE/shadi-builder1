const express = require("express");
const auth = require("../middleware/auth");
const users = require("../core/users/service");
const analyze = require("../core/brain/analyze");
const planAI = require("../core/brain/plan"); // تم التعديل ليتطابق مع اسم ملفك الجديد
const build = require("../core/brain/htmlBuilder");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.post("/analyze", auth, async (req, res) => {
  try {
    // 1. فحص صلاحية الاستخدام للمستخدم
    if (!users.canGenerate(req.user.id)) {
      return res.status(403).json({ ok: false, error: "لقد تجاوزت الحد المسموح به" });
    }

    // 2. تحليل الوصف وفهم نوع الموقع (بنك، ساس، إلخ)
    const analysis = await analyze(req.body.description);
    
    // 3. تجهيز الخطة وتمرير الـ Category للصور
    const plan = await planAI(analysis); 
    
    // 4. بناء الكود النهائي (المصنع)
    const html = await build(plan);

    // 5. حفظ الملف في مجلد الـ public عشان يفتح في المتصفح
    const name = `site-${Date.now()}.html`;
    const dir = path.join(__dirname, "../../../generated"); 
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(dir, name), html);

    // 6. تحديث عداد الاستخدام
    users.incrementUsage(req.user.id);

    // 7. إرجاع الرابط لعرضه في الـ iframe
    res.json({ ok: true, previewUrl: `/generated/${name}` });

  } catch (error) {
    console.error("خطأ في نظام البناء:", error);
    res.status(500).json({ ok: false, error: "حدث خطأ داخلي في المحرك" });
  }
});

module.exports = router;