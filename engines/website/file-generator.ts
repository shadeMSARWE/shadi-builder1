/**
 * WEBSITE_ENGINE_PRO - File Generator
 * Generates: index.html, about.html, services.html, contact.html, styles.css, scripts.js, assets/
 */
import { getProjectPath, writeFiles, ensureDir } from "@/core/storage";
import type { WebsiteStructure } from "./schema";

function escapeHtml(s: string): string {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderNavbar(struct: WebsiteStructure, currentPage: string): string {
  const nav = struct.sections.find((s) => s.type === "navbar");
  const links = (nav?.content?.links as Array<{ label: string; href: string }>) || struct.pages.map((p) => ({ label: p.name, href: p.path }));
  const cta = (nav?.content?.ctaText as string) || "Contact";
  const title = (nav?.content?.title as string) || struct.business_type;
  return `<nav class="navbar">
  <div class="nav-brand">${escapeHtml(title)}</div>
  <div class="nav-links">${links.map((l) => `<a href="${l.href}">${escapeHtml(l.label)}</a>`).join("")}</div>
  <a href="contact.html" class="btn-cta">${escapeHtml(cta)}</a>
</nav>`;
}

function renderSection(section: WebsiteStructure["sections"][0], struct: WebsiteStructure): string {
  const c = section.content || {};
  const type = section.type;
  if (type === "navbar") return "";
  if (type === "hero") {
    return `<section class="hero">
  <h1>${escapeHtml((c.title as string) || "")}</h1>
  <p class="hero-subtitle">${escapeHtml((c.subtitle as string) || "")}</p>
  <a href="contact.html" class="btn-primary">${escapeHtml((c.ctaText as string) || "Get Started")}</a>
  <div class="hero-image"><img src="https://source.unsplash.com/featured/1200x600?${encodeURIComponent(struct.business_type)}" alt="Hero"/></div>
</section>`;
  }
  if (type === "features") {
    const items = (c.items as Array<{ title: string; description: string }>) || [];
    return `<section class="features">
  <h2>${escapeHtml((c.title as string) || "Features")}</h2>
  <div class="features-grid">${items.map((i) => `<div class="feature-card"><h3>${escapeHtml(i.title)}</h3><p>${escapeHtml(i.description)}</p></div>`).join("")}</div>
</section>`;
  }
  if (type === "contact") {
    const phone = c.phone as string;
    const email = c.email as string;
    const whatsapp = c.whatsapp as string;
    return `<section class="contact">
  <h2>${escapeHtml((c.title as string) || "Contact Us")}</h2>
  <form class="contact-form" onsubmit="return handleSubmit(event)">
    <input type="text" name="name" placeholder="Name" required/>
    <input type="email" name="email" placeholder="Email" required/>
    <textarea name="message" placeholder="Message" required></textarea>
    <button type="submit">Send</button>
  </form>
  ${phone ? `<p>📞 ${escapeHtml(phone)}</p>` : ""}
  ${email ? `<p>✉️ ${escapeHtml(email)}</p>` : ""}
  ${whatsapp ? `<a href="https://wa.me/${(whatsapp as string).replace(/\D/g, "")}" class="whatsapp-btn" target="_blank">WhatsApp</a>` : ""}
</section>`;
  }
  if (type === "footer") {
    return `<footer class="footer">${escapeHtml((c.title as string) || `© ${new Date().getFullYear()} ${struct.business_type}`)}</footer>`;
  }
  return "";
}

function renderPage(struct: WebsiteStructure, pageId: string): string {
  const page = struct.pages.find((p) => p.id === pageId);
  const pageSections = struct.sections.filter((s) => s.page_id === pageId).sort((a, b) => a.order - b.order);
  const nav = renderNavbar(struct, pageId);
  const sectionsHtml = pageSections.map((s) => renderSection(s, struct)).join("");
  const hero = struct.sections.find((s) => s.type === "hero");
  const title = (hero?.content?.title as string) || struct.business_type;
  const dir = struct.target_audience?.includes("arabic") ? "rtl" : "ltr";
  const lang = struct.target_audience?.includes("arabic") ? "ar" : "en";

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(title)} - ${escapeHtml(page?.name || "")}</title>
  <meta name="description" content="${escapeHtml(struct.target_audience)}">
  <link rel="stylesheet" href="styles.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": struct.business_type,
    "url": "",
  })}</script>
</head>
<body>
  ${nav}
  <main>${sectionsHtml}</main>
  <script src="scripts.js"></script>
</body>
</html>`;
}

export function generateWebsiteFiles(projectPath: string, struct: WebsiteStructure): void {
  ensureDir(projectPath);
  const files: Array<{ path: string; content: string }> = [];

  for (const page of struct.pages) {
    files.push({ path: page.path, content: renderPage(struct, page.id) });
  }

  const css = `*{box-sizing:border-box}
body{font-family:system-ui;background:#030712;color:#fff;margin:0;line-height:1.6}
.navbar{display:flex;justify-content:space-between;align-items:center;padding:1rem 2rem;border-bottom:1px solid rgba(255,255,255,0.1);background:rgba(0,0,0,0.3);backdrop-filter:blur(10px)}
.nav-links{display:flex;gap:1.5rem}
.nav-links a,.btn-cta{color:#94a3b8;text-decoration:none;transition:color .2s}
.nav-links a:hover{color:#fff}
.btn-cta,.btn-primary{padding:.5rem 1.5rem;border-radius:9999px;background:#6366f1;color:#fff;font-weight:600;border:none;cursor:pointer}
.btn-primary{padding:.75rem 2rem;font-size:1.1rem}
.hero{text-align:center;padding:4rem 2rem}
.hero h1{font-size:3rem;font-weight:900;margin-bottom:1rem}
.hero-subtitle{font-size:1.25rem;color:#94a3b8;margin-bottom:2rem}
.hero-image{margin-top:2rem;border-radius:1rem;overflow:hidden}
.hero-image img{width:100%;max-width:900px;height:auto}
.features{padding:4rem 2rem;background:#020617}
.features h2{text-align:center;font-size:2rem;margin-bottom:2rem}
.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;max-width:1200px;margin:0 auto}
.feature-card{padding:2rem;background:rgba(255,255,255,0.03);border-radius:1rem;border:1px solid rgba(255,255,255,0.05)}
.feature-card h3{font-size:1.25rem;margin-bottom:.5rem}
.feature-card p{color:#94a3b8}
.contact{padding:4rem 2rem;max-width:600px;margin:0 auto}
.contact-form{display:flex;flex-direction:column;gap:1rem}
.contact-form input,.contact-form textarea{padding:.75rem;border-radius:.5rem;border:1px solid rgba(255,255,255,0.1);background:rgba(0,0,0,0.3);color:#fff}
.whatsapp-btn{display:inline-block;margin-top:1rem;padding:.5rem 1rem;background:#25D366;color:#fff;border-radius:.5rem;text-decoration:none}
.footer{text-align:center;padding:2rem;border-top:1px solid rgba(255,255,255,0.1);color:#64748b}
`;

  const js = `function handleSubmit(e){
  e.preventDefault();
  const form=e.target;
  const data=new FormData(form);
  console.log('Contact form:',Object.fromEntries(data));
  alert('Message sent! (Demo)');
  return false;
}`;

  files.push({ path: "styles.css", content: css });
  files.push({ path: "scripts.js", content: js });
  files.push({ path: "package.json", content: JSON.stringify({ name: "ferdous-website", version: "1.0.0", private: true }, null, 2) });
  files.push({ path: "README.md", content: `# Generated by FERDOUS AI OS\n\n${struct.business_type} website` });

  writeFiles(projectPath, files);
}
