import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/db";

export async function GET() {
  const leaderboard = await getLeaderboard();
  return NextResponse.json({ leaderboard });
}

export async function POST() {
  const leaderboard = await getLeaderboard();
  return NextResponse.json({ leaderboard });
}
