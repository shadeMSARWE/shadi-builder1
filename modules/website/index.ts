/**
 * FERDOUS AI - Website Builder Module
 * Independent section with its own generation engine.
 */

import type { ModuleDefinition, StructuredOutput, GenerationOptions, GenerationResult } from "@/core/types";
import { fileGenerator } from "@/engines/file-generator";

const SYSTEM_PROMPT = `You are a professional web designer. Generate a complete website structure as JSON.

Return ONLY valid JSON:
{
  "type": "website",
  "config": {
    "theme": "dark|light",
    "layout": "landing|dashboard|saas|ecommerce",
    "category": "string for images",
    "language": "ar|en"
  },
  "sections": [
    {
      "id": "unique-id",
      "type": "navbar|hero|features|pricing|contact|footer",
      "content": {
        "title": "string",
        "subtitle": "string",
        "ctaText": "string",
        "items": [{"title":"","description":""}],
        "links": [{"label":"","href":"#"}]
      },
      "order": 1
    }
  ],
  "assets": [],
  "files": [],
  "dependencies": []
}

Include: navbar, hero, features (3 items), footer. Use user's language.`;

function getPrompt(input: string, options: Record<string, unknown>) {
  const lang = (options.language as string) || "en";
  const layout = (options.layout as string) || "landing";
  return {
    system: SYSTEM_PROMPT,
    user: `Create a professional website:\n\n"${input}"\n\nLayout: ${layout}. Content language: ${lang}.`,
  };
}

function getSchema() {
  return {
    type: "object",
    required: ["type", "config", "sections", "assets", "files", "dependencies"],
    properties: {
      type: { type: "string" },
      config: { type: "object" },
      sections: { type: "array" },
      assets: { type: "array" },
      files: { type: "array" },
      dependencies: { type: "array" },
    },
  };
}

function ensureSections(data: StructuredOutput): StructuredOutput {
  const sections = data.sections || [];
  const types = sections.map((s) => s.type);
  if (!types.includes("navbar"))
    sections.push({ id: "nav", type: "navbar", content: { title: "Site", links: [] }, order: 0 });
  if (!types.includes("hero"))
    sections.push({
      id: "hero",
      type: "hero",
      content: { title: "Welcome", subtitle: "", ctaText: "Get Started" },
      order: 1,
    });
  if (!types.includes("footer"))
    sections.push({ id: "footer", type: "footer", content: { title: "© 2026" }, order: 999 });
  sections.sort((a, b) => (a.order || 0) - (b.order || 0));
  return { ...data, sections };
}

function render(data: StructuredOutput): { html: string; css: string; js: string } {
  const config = data.config || {};
  const sections = (data.sections || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  const category = (config.category as string) || "technology";
  const theme = (config.theme as string) || "dark";
  const lang = (config.language as string) || "en";
  const dir = lang === "ar" || lang === "he" ? "rtl" : "ltr";

  const hero = sections.find((s) => s.type === "hero");
  const title = (hero?.content?.title as string) || "AI Generated";

  const css = `*{box-sizing:border-box}body{font-family:system-ui;background:#030712;color:#fff;margin:0}.glass{background:rgba(255,255,255,0.03);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.05)}`;

  const js = `document.addEventListener('DOMContentLoaded',()=>{});`;

  const nav = sections.find((s) => s.type === "navbar");
  const links = (nav?.content?.links as Array<{ label: string; href: string }>) || [];
  const navHtml = `<nav class="p-6 flex justify-between items-center border-b border-white/5 glass sticky top-0"><div class="text-2xl font-bold">${escapeHtml((nav?.content?.title as string) || title)}</div><div class="flex gap-6">${links.map((l) => `<a href="${l.href || "#"}">${escapeHtml(l.label || "")}</a>`).join("")}</div><button class="bg-indigo-600 px-6 py-2 rounded-full">${escapeHtml((nav?.content?.ctaText as string) || "Get Started")}</button></nav>`;

  const heroHtml = `<section class="py-20 px-6 text-center"><h1 class="text-5xl font-black mb-6">${escapeHtml((hero?.content?.title as string) || title)}</h1><p class="text-xl text-slate-400 mb-10">${escapeHtml((hero?.content?.subtitle as string) || "")}</p><button class="bg-white text-black px-8 py-4 rounded-2xl font-bold">${escapeHtml((hero?.content?.ctaText as string) || "Start")}</button><div class="mt-16 max-w-5xl mx-auto"><img src="https://source.unsplash.com/featured/1200x600?${encodeURIComponent(category)}" alt="Hero" class="w-full rounded-2xl"/></div></section>`;

  const features = sections.find((s) => s.type === "features");
  const items = (features?.content?.items as Array<{ title: string; description: string }>) || [
    { title: "Feature 1", description: "Description" },
    { title: "Feature 2", description: "Description" },
    { title: "Feature 3", description: "Description" },
  ];
  const featuresHtml = `<section class="py-20 px-6 bg-[#020617]"><div class="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">${items.map((i) => `<div class="glass p-8 rounded-2xl"><h3 class="text-xl font-bold mb-4">${escapeHtml(i.title)}</h3><p class="text-slate-400">${escapeHtml(i.description)}</p></div>`).join("")}</div></section>`;

  const footer = sections.find((s) => s.type === "footer");
  const footerHtml = `<footer class="py-12 border-t border-white/5 text-center text-slate-500">${escapeHtml((footer?.content?.title as string) || `© 2026 ${title}`)}</footer>`;

  const html = `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><script src="https://cdn.tailwindcss.com"></script></head>
<body>${navHtml}${heroHtml}${featuresHtml}${footerHtml}<script>${js}</script></body></html>`;

  return { html, css, js };
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function generate(output: StructuredOutput, options: GenerationOptions): Promise<GenerationResult> {
  const validated = ensureSections(output);
  const { html, css, js } = render(validated);
  const projectId = options.projectId || Date.now().toString();

  const result = await fileGenerator.writeProject(projectId, [
    { path: "index.html", content: html },
    { path: "styles.css", content: css },
    { path: "script.js", content: js },
    { path: "package.json", content: JSON.stringify({ name: `ferdous-${projectId}`, version: "1.0.0", private: true }, null, 2) },
    { path: "README.md", content: `# Generated by FERDOUS AI\n\nProject: ${projectId}` },
  ]);

  return {
    ok: true,
    projectId,
    previewUrl: `/generated/${projectId}/index.html`,
    files: result.files,
  };
}

export const websiteModule: ModuleDefinition = {
  id: "website",
  name: "AI Website Builder",
  description: "Generate full professional websites from text",
  credits: 10,
  getPrompt,
  getSchema,
  generate,
};
