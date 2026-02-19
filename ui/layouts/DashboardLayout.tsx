"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Globe,
  ShoppingCart,
  LayoutDashboard,
  Smartphone,
  Gamepad2,
  Video,
  Image,
  Mic,
  Share2,
  Zap,
  CreditCard,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SIDEBAR_ITEMS = [
  { id: "website", href: "/dashboard/website", icon: Globe, labelKey: "website" },
  { id: "store", href: "/dashboard/store", icon: ShoppingCart, labelKey: "store" },
  { id: "saas", href: "/dashboard/saas", icon: LayoutDashboard, labelKey: "saas" },
  { id: "app", href: "/dashboard/app", icon: Smartphone, labelKey: "app" },
  { id: "game", href: "/dashboard/game", icon: Gamepad2, labelKey: "game" },
  { id: "video", href: "/dashboard/video", icon: Video, labelKey: "video" },
  { id: "image", href: "/dashboard/image", icon: Image, labelKey: "image" },
  { id: "voice", href: "/dashboard/voice", icon: Mic, labelKey: "voice" },
  { id: "social", href: "/dashboard/social", icon: Share2, labelKey: "social" },
  { id: "advanced", href: "/dashboard/advanced", icon: Zap, labelKey: "social" },
  { divider: true },
  { id: "credits", href: "/dashboard/credits", icon: CreditCard, labelKey: "credits" },
  { id: "projects", href: "/dashboard/projects", icon: FolderOpen, labelKey: "projects" },
];

export default function DashboardLayout({
  children,
  strings,
}: {
  children: React.ReactNode;
  strings: Record<string, string>;
}) {
  const pathname = usePathname();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/credits", { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((d) => d.ok && setCredits(d.credits));
    }
  }, []);

  return (
    <div className="min-h-screen flex bg-[#050508]">
      <aside className="w-72 border-r border-white/5 flex flex-col bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="block">
            <h1 className="text-xl font-black tracking-tight">
              FERDOUS <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">AI</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{strings.tagline || "Operating System"}</p>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => {
            if ("divider" in item) return <div key="div" className="my-4 border-t border-white/5" />;
            const Icon = item.icon;
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all",
                  active
                    ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                {strings[item.labelKey] || item.labelKey}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-white/5">
            <span className="text-xs text-slate-500">{strings.credits}</span>
            <span className="font-bold">{credits ?? "—"}</span>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="mt-4 w-full py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-semibold"
          >
            {strings.logout}
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
