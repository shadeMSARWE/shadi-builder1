/**
 * FERDOUS AI - Generate API
 * POST /api/generate - Central generation endpoint
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { analyzePrompt, executePlan } from "@/core/engine/orchestrator";
import { moduleRegistry } from "@/modules/registry";
import { canAfford, deductCredits, CREDIT_COSTS } from "@/services/credits";

export async function POST(req: NextRequest) {
  try {
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

    const body = await req.json();
    const { prompt, language = "en", moduleId } = body;
    if (!prompt?.trim()) {
      return NextResponse.json({ ok: false, error: "Prompt required" }, { status: 400 });
    }

    await moduleRegistry.initModules();

    const { ok: planOk, plan, error: planError } = await analyzePrompt(prompt, { language });
    if (!planOk || !plan) {
      return NextResponse.json({ ok: false, error: planError || "Analysis failed" }, { status: 500 });
    }

    const cost = plan.estimatedCredits;
    const affordable = await canAfford(user.id, plan.projectType);
    if (!affordable) {
      return NextResponse.json({
        ok: false,
        error: "Insufficient credits",
        required: cost,
      }, { status: 403 });
    }

    const projectId = Date.now().toString();
    const result = await executePlan(plan, {
      userId: user.id,
      projectId,
      language,
    });

    if (!result.ok) {
      return NextResponse.json({
        ok: false,
        error: "Generation failed",
        errors: result.errors,
      }, { status: 500 });
    }

    await deductCredits(user.id, cost);

    const first = result.results[0];
    const previewUrl = first?.previewUrl || `/generated/${projectId}/index.html`;
    const dbProjectId = first?.projectId || projectId;

    try {
      await supabase.from("projects").insert({
        user_id: user.id,
        name: (prompt as string).slice(0, 100),
        type: plan.projectType,
        project_id: dbProjectId,
        preview_url: previewUrl,
        config: {},
      });
    } catch (e) {
      console.warn("[API] Project insert failed:", e);
    }

    return NextResponse.json({
      ok: true,
      projectId: dbProjectId,
      previewUrl,
      results: result.results,
      creditsUsed: cost,
    });
  } catch (err) {
    console.error("[API] Generate error:", err);
    return NextResponse.json({ ok: false, error: "Generation failed" }, { status: 500 });
  }
}
