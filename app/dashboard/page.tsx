"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, ShoppingCart, Smartphone, LayoutDashboard, Gamepad2, Video, Image, Mic, Share2, Zap } from "lucide-react";

const MODULES = [
  { id: "website", name: "Website Builder", icon: Globe },
  { id: "store", name: "Online Store", icon: ShoppingCart },
  { id: "app", name: "App Builder", icon: Smartphone },
  { id: "saas", name: "SaaS Builder", icon: LayoutDashboard },
  { id: "game", name: "Game Builder", icon: Gamepad2 },
  { id: "video", name: "Video Generator", icon: Video },
  { id: "image", name: "Image Lab", icon: Image },
  { id: "voice", name: "Voice Generator", icon: Mic },
  { id: "social", name: "Social Engine", icon: Share2 },
  { id: "advanced", name: "Advanced Tools", icon: Zap },
];

export default function DashboardPage() {
  const [credits, setCredits] = useState<number | null>(null);
  const [projects, setProjects] = useState<Array<{ id: string; name: string; preview_url: string }>>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ projectId?: string; previewUrl?: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetch("/api/credits", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => d.ok && setCredits(d.credits));
    fetch("/api/projects", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => d.ok && setProjects(d.projects || []));
  }, []);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prompt: prompt.trim(), language: "en" }),
      });
      const d = await res.json();
      if (d.ok) {
        setResult({ projectId: d.projectId, previewUrl: d.previewUrl });
        setProjects((p) => [{ id: d.projectId, name: prompt.slice(0, 30), preview_url: d.previewUrl }, ...p]);
        if (typeof d.creditsUsed === "number") setCredits((c) => (c ?? 0) - d.creditsUsed);
      } else {
        alert(d.error || "Generation failed");
      }
    } catch (e) {
      alert("Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-72 glass-panel border-r border-white/5 p-6 flex flex-col">
        <Link href="/" className="mb-8">
          <h1 className="text-2xl font-black">
            FERDOUS <span className="gradient-text">AI</span>
          </h1>
          <p className="text-xs text-slate-500">Operating System</p>
        </Link>
        <nav className="flex flex-col gap-2">
          {MODULES.map((m) => (
            <Link
              key={m.id}
              href={`/dashboard?module=${m.id}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 font-semibold text-sm"
            >
              <m.icon className="w-5 h-5 text-indigo-400" />
              {m.name}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="text-xs text-slate-500 mb-1">Credits</div>
          <div className="text-2xl font-black">{credits ?? "—"}</div>
          <Link href="/pricing" className="text-sm text-indigo-400 mt-2 inline-block">
            Top up
          </Link>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="mt-4 w-full py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold text-sm"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <h2 className="text-3xl font-black mb-2">Website Builder</h2>
        <p className="text-slate-500 mb-8">Describe your website. FERDOUS Core will generate it.</p>

        <div className="glass-panel rounded-2xl p-6 mb-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Law firm website, modern barber shop, restaurant with menu..."
            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 resize-none outline-none focus:border-indigo-500/50 placeholder-slate-600"
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 font-bold transition"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>

        {result?.previewUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl p-6 mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold">Preview</span>
              <a
                href={result.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-semibold"
              >
                Open
              </a>
            </div>
            <iframe
              src={result.previewUrl}
              className="w-full h-[500px] rounded-xl bg-white border-0"
              title="Preview"
            />
          </motion.div>
        )}

        <div className="glass-panel rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4">Recent Projects</h3>
          {projects.length === 0 ? (
            <p className="text-slate-500">No projects yet</p>
          ) : (
            <div className="space-y-2">
              {projects.slice(0, 10).map((p) => (
                <a
                  key={p.id}
                  href={p.preview_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2 px-3 rounded-lg hover:bg-white/5"
                >
                  {p.name || p.id}
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
