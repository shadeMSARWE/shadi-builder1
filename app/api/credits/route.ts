import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken, extractBearerToken } from "@/core/auth";
import { getCredits } from "@/core/credits";

export async function GET(req: NextRequest) {
  const token = extractBearerToken(req.headers.get("authorization"));
  if (!token) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const user = await getUserFromToken(token);
  if (!user) return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });

  const credits = await getCredits(user.id);
  return NextResponse.json({ ok: true, credits });
}
