const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const { GENERATED_DIR, GENERATED_LEGACY } = require("../../config/paths");

function exportZip(siteId, res) {
    let sitePath = path.join(GENERATED_DIR, siteId);
    if (!fs.existsSync(sitePath) && GENERATED_LEGACY) {
        sitePath = path.join(GENERATED_LEGACY, siteId);
    }

    // 1. التأكد إن الموقع موجود فعلاً (كودك الأصلي)
    if (!fs.existsSync(sitePath)) {
        console.error(`❌ Export failed: Site ${siteId} not found at ${sitePath}`);
        return res.status(404).json({ 
            ok: false, 
            error: "الموقع غير موجود، ربما انتهت صلاحية الملفات المؤقتة." 
        });
    }

    // 2. إعدادات الـ Headers لتحميل الملف (كودك الأصلي)
    res.setHeader("Content-Disposition", `attachment; filename=FERDOUS_${siteId}.zip`);
    res.setHeader("Content-Type", "application/zip");

    // 3. بدء عملية الضغط (كودك الأصلي)
    const archive = archiver("zip", { zlib: { level: 9 } }); 

    archive.on("error", (err) => {
        console.error("🔥 Archiver Error:", err);
        res.status(500).send({ error: "فشل في إنشاء ملف الـ ZIP" });
    });

    archive.pipe(res);

    // إضافة المحتويات (تعديل ذكي: لو ملف واحد يضغطه، ولو مجلد يضغطه)
    const stats = fs.statSync(sitePath);
    if (stats.isDirectory()) {
        archive.directory(sitePath, false);
    } else {
        // إذا كان ملف HTML (زي ما بنعمل في htmlBuilder)، بنسميه index.html جوا الـ ZIP
        archive.file(sitePath, { name: "index.html" });
    }

    // إنهاء وإرسال (كودك الأصلي)
    archive.finalize();

    console.log(`✅ Project ${siteId} exported successfully as ZIP.`);
}

module.exports = {
    exportZip
};