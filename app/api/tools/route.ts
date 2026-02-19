/**
 * FERDOUS AI - Tools List API
 * GET /api/tools - List all modules
 */

import { NextResponse } from "next/server";
import { moduleRegistry } from "@/modules/registry";

export async function GET() {
  await moduleRegistry.initModules();
  const tools = moduleRegistry.list();
  return NextResponse.json({ ok: true, tools });
}
