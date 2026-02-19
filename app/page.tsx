"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const MODULES = [
  { id: "website", name: "Website Builder", icon: "🌐", href: "/dashboard/website" },
  { id: "store", name: "Store Builder", icon: "🛒", href: "/dashboard/store" },
  { id: "saas", name: "SaaS Builder", icon: "📊", href: "/dashboard/saas" },
  { id: "app", name: "App Builder", icon: "⚛️", href: "/dashboard/app" },
  { id: "game", name: "Game Builder", icon: "🎮", href: "/dashboard/game" },
  { id: "video", name: "Video Factory", icon: "🎬", href: "/dashboard/video" },
  { id: "image", name: "Image Studio", icon: "🖼️", href: "/dashboard/image" },
  { id: "voice", name: "Voice Studio", icon: "🎙️", href: "/dashboard/voice" },
  { id: "social", name: "Social AI", icon: "📢", href: "/dashboard/social" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050508]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.12),transparent)]" />
      <header className="relative z-10 p-6 flex justify-between items-center border-b border-white/5">
        <h1 className="text-2xl font-black">
          FERDOUS <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">AI</span> OS
        </h1>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 rounded-xl hover:bg-white/5 font-semibold text-sm">
            Log in
          </Link>
          <Link href="/dashboard/website" className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm">
            Dashboard
          </Link>
        </div>
      </header>
      <main className="relative z-10 max-w-7xl mx-auto p-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h2 className="text-5xl font-black mb-4">
            One Platform. <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Infinite Creation.</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Generate websites, stores, SaaS, apps, games, video, images, voice, and social content.
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
                <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 h-full transition-all hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5">
                  <div className="text-4xl mb-4">{mod.icon}</div>
                  <h3 className="font-bold text-lg">{mod.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
