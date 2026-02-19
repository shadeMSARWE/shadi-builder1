"use client";

import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"
  );
}

export default function LoginPage() {
  useEffect(() => {
    getSupabase().auth.getSession().then(({ data: { session } }) => {
      if (session) {
        localStorage.setItem("token", session.access_token);
        window.location.href = "/dashboard/website";
      }
    });
  }, []);

  async function handleGoogleLogin() {
    const { error } = await getSupabase().auth.signInWithOAuth({ provider: "google" });
    if (error) alert(error.message);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050508]">
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-12 max-w-md w-full text-center">
        <h1 className="text-3xl font-black mb-2">
          FERDOUS <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">AI</span> OS
        </h1>
        <p className="text-slate-500 mb-8">The Ultimate AI Operating System</p>
        <button
          onClick={handleGoogleLogin}
          className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-slate-200 transition"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
