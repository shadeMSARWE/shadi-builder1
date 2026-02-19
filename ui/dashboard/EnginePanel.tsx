"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface EnginePanelProps {
  engineId: string;
  title: string;
  strings: Record<string, string>;
}

export default function EnginePanel({ engineId, title, strings }: EnginePanelProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ projectId?: string; previewUrl?: string } | null>(null);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prompt: prompt.trim(), engineId, language: "en" }),
      });
      const d = await res.json();
      if (d.ok) setResult({ projectId: d.projectId, previewUrl: d.previewUrl });
      else alert(d.error || "Failed");
    } catch (e) {
      alert("Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-black mb-2">{title}</h1>
        <p className="text-slate-500">{strings.promptPlaceholder}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 mb-6"
      >
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={strings.promptPlaceholder}
          className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 resize-none outline-none focus:border-indigo-500/50"
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 font-bold transition-all shadow-lg shadow-indigo-500/25"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </span>
            ) : (
              strings.generate
            )}
          </button>
        </div>
      </motion.div>

      {result?.previewUrl && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <span className="font-semibold">{strings.preview}</span>
            <div className="flex gap-2">
              <a
                href={result.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium"
              >
                Open
              </a>
              <button
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  const res = await fetch(`/api/export/${result.projectId}`, { headers: { Authorization: `Bearer ${token}` } });
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `FERDOUS_${result.projectId}.zip`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium"
              >
                {strings.download}
              </button>
            </div>
          </div>
          <iframe
            src={result.previewUrl}
            className="w-full h-[500px] bg-white border-0"
            title="Preview"
          />
        </motion.div>
      )}
    </div>
  );
}
