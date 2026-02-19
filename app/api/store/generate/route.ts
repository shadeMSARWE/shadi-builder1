import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken, extractBearerToken } from "@/core/auth";
import { orchestrate } from "@/system/orchestrator";
import "@/engines/loader";

export async function POST(req: NextRequest) {
  const token = extractBearerToken(req.headers.get("authorization"));
  if (!token) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const user = await getUserFromToken(token);
  if (!user) return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });

  const { prompt, language } = await req.json();
  if (!prompt?.trim()) return NextResponse.json({ ok: false, error: "Prompt required" }, { status: 400 });

  const result = await orchestrate({ prompt: prompt.trim(), userId: user.id, language, engineId: "store" });
  if (!result.ok) return NextResponse.json(result, { status: 500 });
  return NextResponse.json(result);
}
