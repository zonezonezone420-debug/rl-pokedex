import { NextResponse } from "next/server";

// Voice narration is a stub in this build: the original app polled an
// external TTS job. Without a configured provider we report unavailable
// and the client skips polling gracefully.
export async function POST(req) {
  const { capture } = await req.json();
  if (!process.env.TTS_API_KEY) {
    return NextResponse.json({
      capture: { ...capture, voiceStatus: "unavailable" },
    });
  }
  return NextResponse.json({
    capture: { ...capture, voiceStatus: "unavailable" },
  });
}
