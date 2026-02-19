/**
 * SAAS_ENGINE - Controller
 */
import { chatJson } from "@/core/ai";
import { getProjectPath, writeFiles } from "@/core/storage";

const SYSTEM = `Generate SaaS structure as JSON:
{"name":"string","plans":[{"id":"free","name":"Free","price":0,"features":[]},{"id":"pro","name":"Pro","price":29,"features":[]}],"dashboard_sections":["overview","analytics"]}
Return ONLY valid JSON.`;

export async function generate(input: {
  prompt: string;
  userId: string;
  language?: string;
}): Promise<{ ok: boolean; projectId?: string; previewUrl?: string; error?: string }> {
  try {
    const raw = await chatJson<{ name: string; plans: Array<{ id: string; name: string; price: number; features: string[] }>; dashboard_sections: string[] }>(SYSTEM, `Create SaaS: ${input.prompt}`);
    const projectId = `saas_${Date.now()}`;
    const projectPath = getProjectPath("saas", projectId);

    const plans = raw.plans || [{ id: "free", name: "Free", price: 0, features: ["Feature 1"] }, { id: "pro", name: "Pro", price: 29, features: ["All features"] }];
    const name = raw.name || "SaaS";

    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name}</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-slate-900 text-white">
<nav class="p-4 border-b border-white/10 flex justify-between"><span class="font-bold">${name}</span><a href="dashboard.html">Dashboard</a></nav>
<main class="max-w-4xl mx-auto p-8">
<h1 class="text-4xl font-bold mb-8">Pricing</h1>
<div class="grid md:grid-cols-2 gap-6">${plans.map(p => `
<div class="border border-white/10 rounded-xl p-6">
  <h2 class="text-xl font-bold">${p.name}</h2>
  <p class="text-3xl font-black my-4">$${p.price}<span class="text-sm font-normal text-slate-400">/mo</span></p>
  <ul class="space-y-2">${(p.features || []).map(f => `<li>✓ ${f}</li>`).join("")}</ul>
  <button class="mt-4 w-full py-2 bg-indigo-600 rounded">Subscribe</button>
</div>`).join("")}</div>
</main>
</body>
</html>`;

    const dashboard = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Dashboard - ${name}</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-slate-900 text-white p-6">
<h1 class="text-2xl font-bold mb-6">Dashboard</h1>
<div class="grid md:grid-cols-2 gap-4">
<div class="border border-white/10 rounded-lg p-4">Overview</div>
<div class="border border-white/10 rounded-lg p-4">Analytics</div>
</div>
</body>
</html>`;

    writeFiles(projectPath, [
      { path: "index.html", content: html },
      { path: "dashboard.html", content: dashboard },
      { path: "package.json", content: JSON.stringify({ name: "ferdous-saas", private: true }, null, 2) },
    ]);

    return { ok: true, projectId, previewUrl: `/generated/saas/${projectId}/index.html` };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Generation failed" };
  }
}
