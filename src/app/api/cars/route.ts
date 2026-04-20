import { NextResponse } from "next/server";
import { CAR_MAKES } from "@/lib/data/cars";

export async function GET() {
  return NextResponse.json(CAR_MAKES);
}
