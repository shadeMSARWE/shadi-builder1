const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

// المسار لازم يكون دقيق جداً حسب هيكل ملفاتك
const GENERATED_DIR = path.join(__dirname, "../../../generated");

function exportZip(siteId, res) {
    // مسار المجلد اللي فيه ملفات الموقع (index, about, etc...)
    const siteDir = path.join(GENERATED_DIR, siteId);

    // 1. التأكد إن الموقع موجود فعلاً
    if (!fs.existsSync(siteDir)) {
        console.error(`❌ Export failed: Site ${siteId} not found at ${siteDir}`);
        return res.status(404).json({ 
            ok: false, 
            error: "الموقع غير موجود، ربما انتهت صلاحية الملفات المؤقتة." 
        });
    }

    // 2. إعدادات الـ Headers لتحميل الملف
    res.setHeader("Content-Disposition", `attachment; filename=ShadiAI_${siteId}.zip`);
    res.setHeader("Content-Type", "application/zip");

    // 3. بدء عملية الضغط
    const archive = archiver("zip", { zlib: { level: 9 } }); // أعلى مستوى ضغط

    // التعامل مع الأخطاء أثناء الضغط
    archive.on("error", (err) => {
        console.error("🔥 Archiver Error:", err);
        res.status(500).send({ error: "فشل في إنشاء ملف الـ ZIP" });
    });

    // ربط الـ archive بالـ response (الرد)
    archive.pipe(res);

    // إضافة محتويات المجلد (الملفات اللي ولدها الـ AI)
    archive.directory(siteDir, false);

    // إنهاء وإرسال
    archive.finalize();

    console.log(`✅ Project ${siteId} exported successfully as ZIP.`);
}

module.exports = {
    exportZip
};