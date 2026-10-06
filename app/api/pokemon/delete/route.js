import { NextResponse } from "next/server";
import { deleteEntry } from "@/lib/db";

export async function POST(req) {
  const { _id, trainer } = await req.json();
  if (!_id) return NextResponse.json({ error: "Missing _id" }, { status: 400 });
  await deleteEntry(trainer || "trainer", _id);
  return NextResponse.json({ ok: true });
}
