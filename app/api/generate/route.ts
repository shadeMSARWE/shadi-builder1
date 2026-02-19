/**
 * FERDOUS AI OS - Generate API
 */
import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken, extractBearerToken } from "@/core/auth";
import { orchestrate } from "@/system/orchestrator";
import "@/engines/loader";

export async function POST(req: NextRequest) {
  try {
    const token = extractBearerToken(req.headers.get("authorization"));
    if (!token) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    const user = await getUserFromToken(token);
    if (!user) return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });

    const body = await req.json();
    const { prompt, language = "en", engineId } = body;
    if (!prompt?.trim()) return NextResponse.json({ ok: false, error: "Prompt required" }, { status: 400 });

    const result = await orchestrate({
      prompt: prompt.trim(),
      userId: user.id,
      language,
      engineId,
    });

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: result.error === "Insufficient credits" ? 403 : 500 });
    }

    return NextResponse.json({
      ok: true,
      projectId: result.projectId,
      previewUrl: result.previewUrl,
    });
  } catch (err) {
    console.error("[API] Generate error:", err);
    return NextResponse.json({ ok: false, error: "Generation failed" }, { status: 500 });
  }
}
