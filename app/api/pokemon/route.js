import { NextResponse } from "next/server";
import { listEntries } from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const trainer = searchParams.get("trainer") || "trainer";
  const pokemon = await listEntries(trainer);
  return NextResponse.json({ pokemon });
}
