"use client";

import { useEffect } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

function getSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";
  return createClient(url, key);
}

export default function LoginPage() {
  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        localStorage.setItem("token", session.access_token);
        window.location.href = "/dashboard";
      }
    });
  }, []);

  async function handleGoogleLogin() {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) alert(error.message);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050508]">
      <div className="glass-panel rounded-3xl p-12 max-w-md w-full text-center">
        <h1 className="text-3xl font-black mb-2">
          FERDOUS <span className="gradient-text">AI</span>
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
