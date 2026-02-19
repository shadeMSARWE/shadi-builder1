import { NextRequest, NextResponse } from "next/server";
import { strings, getDirection } from "@/lib/i18n";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params;
  const l = lang || "en";
  return NextResponse.json({
    ok: true,
    lang: l,
    direction: getDirection(l),
    strings: strings[l] || strings.en,
  });
}
