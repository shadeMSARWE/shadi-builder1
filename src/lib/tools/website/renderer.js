/**
 * FERDOUS AI OS - Website Tool Renderer
 * Converts structured JSON output to HTML/CSS/JS
 */
function render(data) {
  const config = data.config || {};
  const sections = (data.sections || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  const category = config.category || "technology";
  const theme = config.theme || "dark";
  const lang = config.language || "ar";
  const dir = lang === "ar" || lang === "he" ? "rtl" : "ltr";
  const title = getTitle(data);

  const css = renderCSS(theme);
  const js = renderJS();
  const html = renderHTML(title, sections, category, dir, lang);

  return { html, css, js };
}

function getTitle(data) {
  const hero = (data.sections || []).find(s => s.type === "hero");
  return hero?.content?.title || "AI Generated Project";
}

function renderCSS(theme) {
  const bg = theme === "dark" ? "#030712" : "#f8fafc";
  const text = theme === "dark" ? "#ffffff" : "#0f172a";
  return `/* FERDOUS AI OS - Generated Styles */
* { box-sizing: border-box; }
body {
  font-family: 'Tajawal', 'Outfit', sans-serif;
  background-color: ${bg};
  color: ${text};
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
}

function renderJS() {
  return `// FERDOUS AI OS - Generated Script
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.btn-cta, button').forEach(function(btn) {
    btn.addEventListener('click', function() {
      console.log('FERDOUS AI - Element clicked');
    });
  });
});
`;
}

function renderHTML(title, sections, category, dir, lang) {
  const navHtml = renderNav(sections);
  const heroHtml = renderHero(sections, category);
  const featuresHtml = renderFeatures(sections);
  const footerHtml = renderFooter(sections, title);

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./styles.css">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  ${navHtml}
  ${heroHtml}
  ${featuresHtml}
  ${footerHtml}
  <script src="./script.js"></script>
</body>
</html>`;
}

function renderNav(sections) {
  const nav = sections.find(s => s.type === "navbar");
  const links = nav?.content?.links || [
    { label: "الرئيسية", href: "#" },
    { label: "المميزات", href: "#" },
    { label: "الأسعار", href: "#" }
  ];
  const cta = nav?.content?.ctaText || "ابدأ الآن";
  return `<nav class="p-6 flex justify-between items-center border-b border-white/5 glass sticky top-0 z-50">
    <div class="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">${escapeHtml(nav?.content?.title || "FERDOUS AI")}</div>
    <div class="space-x-6 space-x-reverse hidden md:flex text-sm font-medium text-slate-400">
      ${links.map(l => `<a href="${escapeHtml(l.href || "#")}" class="hover:text-white transition">${escapeHtml(l.label || "")}</a>`).join("\n      ")}
    </div>
    <button class="btn-cta bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-full text-sm font-bold transition shadow-lg shadow-indigo-500/20">${escapeHtml(cta)}</button>
  </nav>`;
}

function renderHero(sections, category) {
  const hero = sections.find(s => s.type === "hero");
  const title = hero?.content?.title || "مستقبل الابتكار";
  const subtitle = hero?.content?.subtitle || "هذا الموقع تم توليده بالكامل بواسطة FERDOUS AI OS.";
  const cta1 = hero?.content?.ctaText || "تجربة مجانية";
  const cta2 = hero?.content?.ctaSecondary || "شاهد الفيديو";
  return `<section class="relative py-20 px-6 overflow-hidden hero-gradient">
    <div class="max-w-6xl mx-auto text-center relative z-10">
      <h1 class="text-5xl md:text-7xl font-black mb-6 leading-tight">${escapeHtml(title)} <br> <span class="text-indigo-500">بلمسة ذكاء اصطناعي</span></h1>
      <p class="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">${escapeHtml(subtitle)}</p>
      <div class="flex flex-wrap justify-center gap-4">
        <button class="btn-cta bg-white text-black px-8 py-4 rounded-2xl font-black hover:bg-slate-200 transition">${escapeHtml(cta1)}</button>
        <button class="btn-cta glass px-8 py-4 rounded-2xl font-black hover:bg-white/5 transition">${escapeHtml(cta2)}</button>
      </div>
    </div>
    <div class="mt-16 max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10 glass">
      <img src="https://source.unsplash.com/featured/1200x600?${encodeURIComponent(category)}" alt="Hero" class="w-full object-cover">
    </div>
  </section>`;
}

function renderFeatures(sections) {
  const features = sections.find(s => s.type === "features");
  const items = features?.content?.items || [
    { title: "أداء فائق السرعة", description: "تم تحسين كل سطر برمج في هذا الموقع ليعطيك أفضل تجربة مستخدم ممكنة." },
    { title: "تصميم مستقبلي", description: "واجهات زجاجية وتنسيقات عصرية تتناسب مع هوية شركتك التقنية." },
    { title: "ذكاء متكامل", description: "الموقع مجهز بأدوات تحليل وتتبع مدمجة لفهم سلوك زوارك." }
  ];
  const colors = ["indigo", "purple", "blue"];
  const html = items.map((item, i) => `
    <div class="glass p-8 rounded-3xl group hover:border-${colors[i % 3]}-500/50 transition">
      <div class="w-12 h-12 bg-${colors[i % 3]}-500/20 rounded-xl flex items-center justify-center mb-6 text-${colors[i % 3]}-400 font-bold text-xl">0${i + 1}</div>
      <h3 class="text-xl font-bold mb-4">${escapeHtml(item.title || "")}</h3>
      <p class="text-slate-400">${escapeHtml(item.description || "")}</p>
    </div>`).join("");
  return `<section class="py-20 px-6 bg-[#020617]">
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">${html}</div>
  </section>`;
}

function renderFooter(sections, title) {
  const footer = sections.find(s => s.type === "footer");
  const text = footer?.content?.title || `© 2026 ${title} – تم التطوير بواسطة FERDOUS AI OS`;
  return `<footer class="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
    <p>${escapeHtml(text)}</p>
  </footer>`;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = {
  render
};
