/**
 * FERDOUS AI - Credits API
 * GET /api/credits - Get user credits
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getCredits } from "@/services/credits";

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });
  }

  const credits = await getCredits(user.id);
  return NextResponse.json({ ok: true, credits });
}
