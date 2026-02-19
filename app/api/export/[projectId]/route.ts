import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken, extractBearerToken } from "@/core/auth";
import { GENERATED } from "@/core/storage";
import fs from "fs";
import path from "path";
const archiver = require("archiver");

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const token = extractBearerToken(req.headers.get("authorization"));
  if (!token) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const user = await getUserFromToken(token);
  if (!user) return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });

  const { projectId } = await params;
  const prefixes = ["web_", "store_", "saas_", "app_", "game_", "video_", "img_", "voice_", "social_", "adv_"];
  const engine = prefixes.find((p) => projectId.startsWith(p));
  let projectPath = "";
  if (engine) {
    const map: Record<string, keyof typeof GENERATED> = {
      web_: "websites",
      store_: "stores",
      saas_: "saas",
      app_: "apps",
      game_: "games",
      video_: "videos",
      img_: "images",
      voice_: "voices",
      social_: "social",
      adv_: "advanced",
    };
    projectPath = path.join(GENERATED[map[engine]], projectId);
  }
  if (!projectPath || !fs.existsSync(projectPath)) {
    return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
  }

  const chunks: Buffer[] = [];
  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.on("data", (chunk: Buffer) => chunks.push(chunk));
  const buffer = await new Promise<Buffer>((resolve, reject) => {
    archive.on("end", () => resolve(Buffer.concat(chunks)));
    archive.on("error", reject);
    archive.directory(projectPath, false);
    archive.finalize();
  });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename=FERDOUS_${projectId}.zip`,
    },
  });
}
