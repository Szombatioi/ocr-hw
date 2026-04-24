import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const apiKey = searchParams.get("apikey");
  const url = searchParams.get("url");
  const isOverlayRequired = searchParams.get("isOverlayRequired") ?? "true";

  if (!apiKey || !url) {
    return NextResponse.json({ error: "Missing apikey or url" }, { status: 400 });
  }

  const ocrUrl = `https://api.ocr.space/parse/imageurl?apikey=${encodeURIComponent(apiKey)}&url=${encodeURIComponent(url)}&isOverlayRequired=${isOverlayRequired}`;
  const ocrRes = await fetch(ocrUrl);
  const data = await ocrRes.json();

  return NextResponse.json(data);
}
