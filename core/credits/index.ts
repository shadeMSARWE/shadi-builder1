/**
 * FERDOUS AI OS - Credits Core
 */
import { createServerClient } from "@/lib/supabase";

export const CREDIT_COSTS = {
  website: 15,
  store: 30,
  saas: 50,
  app: 50,
  game: 75,
  video: 50,
  image: 5,
  voice: 10,
  social: 5,
  advanced: 10,
} as const;

export async function getCredits(userId: string): Promise<number> {
  const supabase = createServerClient();
  const { data } = await supabase.from("profiles").select("credits").eq("id", userId).single();
  return data?.credits ?? 0;
}

export async function deductCredits(userId: string, amount: number): Promise<boolean> {
  const credits = await getCredits(userId);
  if (credits < amount) return false;
  const supabase = createServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({ credits: credits - amount, updated_at: new Date().toISOString() })
    .eq("id", userId);
  return !error;
}

export async function canAfford(userId: string, engineId: keyof typeof CREDIT_COSTS): Promise<boolean> {
  const cost = CREDIT_COSTS[engineId] ?? 10;
  const credits = await getCredits(userId);
  return credits >= cost;
}

export async function logUsage(userId: string, engineId: string, creditsUsed: number, projectId: string) {
  const supabase = createServerClient();
  await supabase.from("generation_history").insert({
    user_id: userId,
    project_id: projectId,
    module: engineId,
    credits_used: creditsUsed,
    status: "success",
  });
}
