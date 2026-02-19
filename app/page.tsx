"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const MODULES = [
  { id: "website", name: "Website Builder", desc: "Professional websites", icon: "🌐", href: "/dashboard?module=website" },
  { id: "store", name: "Online Store", desc: "Ecommerce with Stripe", icon: "🛒", href: "/dashboard?module=store" },
  { id: "app", name: "App Builder", desc: "Web + Mobile apps", icon: "⚛️", href: "/dashboard?module=app" },
  { id: "saas", name: "SaaS Builder", desc: "Dashboard, billing, admin", icon: "📊", href: "/dashboard?module=saas" },
  { id: "game", name: "Game Builder", desc: "2D + 3D games", icon: "🎮", href: "/dashboard?module=game" },
  { id: "video", name: "Video Generator", desc: "Script, voiceover, export", icon: "🎬", href: "/dashboard?module=video" },
  { id: "image", name: "Image Lab", desc: "Upscale, mockups", icon: "🖼️", href: "/dashboard?module=image" },
  { id: "voice", name: "Voice Generator", desc: "TTS, podcast mode", icon: "🎙️", href: "/dashboard?module=voice" },
  { id: "social", name: "Social Engine", desc: "Hooks, captions, schedule", icon: "📢", href: "/dashboard?module=social" },
  { id: "advanced", name: "Advanced Tools", desc: "Automation, workflows", icon: "⚡", href: "/dashboard?module=advanced" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050508]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />
      <div className="relative z-10">
        <header className="p-6 flex justify-between items-center border-b border-white/5 glass-panel">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              FERDOUS <span className="gradient-text">AI</span>
            </h1>
            <p className="text-xs text-slate-500">The Ultimate AI Operating System</p>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 rounded-xl hover:bg-white/5 font-semibold text-sm">
              Log in
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm transition"
            >
              Dashboard
            </Link>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black mb-4">
              One Platform. <span className="gradient-text">Infinite Creation.</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Generate websites, stores, apps, SaaS, games, video, images, voice, and social content.
              Each section is a full world. All orchestrated by FERDOUS Core.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {MODULES.map((mod, i) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={mod.href}>
                  <div className="tool-card glass-panel rounded-2xl p-6 h-full border border-white/5 hover:border-indigo-500/40">
                    <div className="text-4xl mb-4">{mod.icon}</div>
                    <h3 className="font-bold text-lg mb-2">{mod.name}</h3>
                    <p className="text-sm text-slate-400">{mod.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
