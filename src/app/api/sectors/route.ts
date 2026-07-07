import { NextResponse } from "next/server";
import { SECTORS } from "@/lib/sectors";

export async function GET() {
  return NextResponse.json({ sectors: SECTORS });
}