/**
 * مُنشئ المواقع – يُرجع HTML و CSS و JS منفصلة ومنظمة
 * للحفظ في مجلد المشروع ضمن generated/<projectId>/
 */
module.exports = async (plan) => {
  const category = plan.category || "technology";
  const title = plan.title || "AI Generated Project";

  const css = `/* Shadi AI Builder – ملف التنسيقات */
* { box-sizing: border-box; }
body {
  font-family: 'Tajawal', sans-serif;
  background-color: #030712;
  color: #ffffff;
  margin: 0;
}
.glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.hero-gradient {
  background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%);
}
nav a:hover, .btn-cta:hover { opacity: 0.9; }
`;

  const js = `// Shadi AI Builder – السكربت التفاعلي
document.addEventListener('DOMContentLoaded', function() {
  var btns = document.querySelectorAll('.btn-cta, button');
  btns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      console.log('Shadi AI – Element clicked');
    });
  });
});
`;

  const featuresHtml = plan.sections && plan.sections.includes("Features")
    ? `
    <div class="glass p-8 rounded-3xl group hover:border-indigo-500/50 transition">
      <div class="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 text-indigo-400 font-bold text-xl">01</div>
      <h3 class="text-xl font-bold mb-4">أداء فائق السرعة</h3>
      <p class="text-slate-400">تم تحسين كل سطر برمج في هذا الموقع ليعطيك أفضل تجربة مستخدم ممكنة.</p>
    </div>
    <div class="glass p-8 rounded-3xl group hover:border-purple-500/50 transition">
      <div class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-400 font-bold text-xl">02</div>
      <h3 class="text-xl font-bold mb-4">تصميم مستقبلي</h3>
      <p class="text-slate-400">واجهات زجاجية وتنسيقات عصرية تتناسب مع هوية شركتك التقنية.</p>
    </div>
    <div class="glass p-8 rounded-3xl group hover:border-blue-500/50 transition">
      <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 text-blue-400 font-bold text-xl">03</div>
      <h3 class="text-xl font-bold mb-4">ذكاء متكامل</h3>
      <p class="text-slate-400">الموقع مجهز بأدوات تحليل وتتبع مدمجة لفهم سلوك زوارك.</p>
    </div>
    `
    : "";

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./styles.css">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <nav class="p-6 flex justify-between items-center border-b border-white/5 glass sticky top-0 z-50">
    <div class="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">${title}</div>
    <div class="space-x-6 space-x-reverse hidden md:flex text-sm font-medium text-slate-400">
      <a href="#" class="hover:text-white transition">الرئيسية</a>
      <a href="#" class="hover:text-white transition">المميزات</a>
      <a href="#" class="hover:text-white transition">الأسعار</a>
    </div>
    <button class="btn-cta bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-full text-sm font-bold transition shadow-lg shadow-indigo-500/20">ابدأ الآن</button>
  </nav>

  <section class="relative py-20 px-6 overflow-hidden hero-gradient">
    <div class="max-w-6xl mx-auto text-center relative z-10">
      <h1 class="text-5xl md:text-7xl font-black mb-6 leading-tight">مستقبل الـ ${title} <br> <span class="text-indigo-500">بلمسة ذكاء اصطناعي</span></h1>
      <p class="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">هذا الموقع تم توليده بالكامل بواسطة Shadi AI Builder. حلول ذكية، تصاميم عصرية، وأداء لا يضاهى.</p>
      <div class="flex flex-wrap justify-center gap-4">
        <button class="btn-cta bg-white text-black px-8 py-4 rounded-2xl font-black hover:bg-slate-200 transition">تجربة مجانية</button>
        <button class="btn-cta glass px-8 py-4 rounded-2xl font-black hover:bg-white/5 transition">شاهد الفيديو</button>
      </div>
    </div>
    <div class="mt-16 max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10 glass">
      <img src="https://source.unsplash.com/featured/1200x600?${category},app" alt="Hero" class="w-full object-cover">
    </div>
  </section>

  <section class="py-20 px-6 bg-[#020617]">
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">${featuresHtml}</div>
  </section>

  <footer class="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
    <p>© 2026 ${title} – تم التطوير بواسطة Shadi AI Builder</p>
  </footer>
  <script src="./script.js"></script>
</body>
</html>
`;

  return { html, css, js };
};
