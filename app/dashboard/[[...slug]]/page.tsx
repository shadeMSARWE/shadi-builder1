"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/ui/layouts/DashboardLayout";
import EnginePanel from "@/ui/dashboard/EnginePanel";

const ENGINES: Record<string, string> = {
  website: "Website Builder",
  store: "Store Builder",
  saas: "SaaS Builder",
  app: "App Builder",
  game: "Game Builder",
  video: "Video Factory",
  image: "Image Studio",
  voice: "Voice Studio",
  social: "Social AI",
  advanced: "Advanced Tools",
};

export default function DashboardPage() {
  const params = useParams();
  const slug = (params?.slug as string[]) || [];
  const engineId = slug[0] || "website";
  const [strings, setStrings] = useState<Record<string, string>>({});
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const l = localStorage.getItem("lang") || "en";
    setLang(l);
    fetch(`/api/i18n/${l}`)
      .then((r) => r.json())
      .then((d) => d.ok && setStrings(d.strings || {}));
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === "ar" || lang === "he" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const title = ENGINES[engineId] || ENGINES.website;

  return (
    <DashboardLayout strings={strings}>
      <div className="min-h-screen bg-gradient-to-b from-[#050508] via-[#0a0a12] to-[#050508]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.08),transparent)] pointer-events-none" />
        <div className="relative">
          <EnginePanel engineId={engineId} title={title} strings={strings} />
        </div>
      </div>
    </DashboardLayout>
  );
}
