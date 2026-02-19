/**
 * FERDOUS AI OS - Auth Core
 */
import { createServerClient } from "@/lib/supabase";

export async function getUserFromToken(token: string) {
  const supabase = createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7).trim() || null;
}
