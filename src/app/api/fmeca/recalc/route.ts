import { NextRequest, NextResponse } from "next/server";
import { updateScoresAndMaybeCreateWO } from "@/lib/fmeca";

export async function POST(req: NextRequest) {
  const { fmId, severity, occurrence, detectability } = await req.json();
  if (!fmId) return NextResponse.json({ error: "fmId required" }, { status: 400 });

  const fm = await updateScoresAndMaybeCreateWO(
    fmId,
    severity,
    occurrence,
    detectability
  );
  return NextResponse.json(fm);
}
