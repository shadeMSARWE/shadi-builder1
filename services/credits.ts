/**
 * FERDOUS AI - Credit Service
 * Credit tracking, usage per generation, billing integration
 */

import { createServerClient } from "@/lib/supabase";

function getClient() {
  return createServerClient();
}

export const CREDIT_COSTS = {
  website: 10,
  store: 25,
  app: 50,
  saas: 50,
  game: 75,
  video: 50,
  image: 5,
  voice: 10,
  social: 5,
  advanced: 10,
} as const;

export const PLANS = {
  free: { credits: 500, maxProjects: 5 },
  pro: { credits: 5000, maxProjects: 50 },
  enterprise: { credits: 50000, maxProjects: 500 },
} as const;

export async function getCredits(userId: string): Promise<number> {
  const supabase = getClient();
  const { data } = await supabase.from("profiles").select("credits").eq("id", userId).single();
  return data?.credits ?? 0;
}

export async function deductCredits(userId: string, amount: number): Promise<boolean> {
  const supabase = getClient();
  const credits = await getCredits(userId);
  if (credits < amount) return false;
  const { error } = await supabase
    .from("profiles")
    .update({ credits: credits - amount, updated_at: new Date().toISOString() })
    .eq("id", userId);
  return !error;
}

export async function canAfford(userId: string, moduleId: string): Promise<boolean> {
  const cost = CREDIT_COSTS[moduleId as keyof typeof CREDIT_COSTS] ?? 10;
  const credits = await getCredits(userId);
  return credits >= cost;
}
