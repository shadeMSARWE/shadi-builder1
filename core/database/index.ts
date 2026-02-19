/**
 * FERDOUS AI OS - Database Core
 * Project metadata storage
 */
import { createServerClient } from "@/lib/supabase";

export interface ProjectMeta {
  id: string;
  user_id: string;
  name: string;
  type: string;
  project_id: string;
  preview_url: string;
  config: Record<string, unknown>;
  created_at?: string;
}

export async function createProject(data: Omit<ProjectMeta, "id" | "created_at">): Promise<void> {
  const supabase = createServerClient();
  await supabase.from("projects").insert({
    user_id: data.user_id,
    name: data.name,
    type: data.type,
    project_id: data.project_id,
    preview_url: data.preview_url,
    config: data.config || {},
  });
}

export async function getProjectsByUser(userId: string): Promise<ProjectMeta[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data || []) as ProjectMeta[];
}
