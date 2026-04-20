import { NextRequest, NextResponse } from "next/server";
import { scrapeAllParts } from "@/lib/scraper";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const subcategories = url.searchParams.get("subcategories")?.split(",").filter(Boolean) ?? [];
  const fitment = url.searchParams.get("fitment") ?? "Universal";

  if (subcategories.length === 0) {
    return NextResponse.json({ error: "subcategories param required" }, { status: 400 });
  }

  const parts = scrapeAllParts(subcategories, fitment);
  return NextResponse.json({ parts, scrapedAt: new Date().toISOString() });
}
