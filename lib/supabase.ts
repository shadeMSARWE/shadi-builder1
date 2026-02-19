/**
 * FERDOUS AI - Supabase Client
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase: SupabaseClient = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseAnonKey || "placeholder");

let _serverClient: SupabaseClient | null = null;
export function createServerClient(): SupabaseClient {
  if (_serverClient) return _serverClient;
  _serverClient = createClient(
    supabaseUrl || "https://placeholder.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey || "placeholder"
  );
  return _serverClient;
}
