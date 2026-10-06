import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const trainer = searchParams.get("trainer") || "trainer";
  const user = await getOrCreateUser(trainer);
  return NextResponse.json({ user });
}
