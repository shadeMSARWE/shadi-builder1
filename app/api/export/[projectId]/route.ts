/**
 * FERDOUS AI - Export ZIP API
 * GET /api/export/[projectId] - Download project as ZIP
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { fileGenerator } from "@/engines/file-generator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const supabase = createServerClient();
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) {
    return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });
  }

  try {
    const zipBuffer = await fileGenerator.exportZip(projectId);
    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=FERDOUS_${projectId}.zip`,
      },
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Export failed" }, { status: 404 });
  }
}
