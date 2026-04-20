import { NextResponse } from "next/server";
import { CUSTOMIZATION_CATEGORIES } from "@/lib/data/customizations";

export async function GET() {
  return NextResponse.json(CUSTOMIZATION_CATEGORIES);
}
