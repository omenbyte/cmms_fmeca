import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const list = await prisma.failureMode.findMany({
    include: { equipment: true },
    orderBy: { rpi: "desc" },
  });
  return NextResponse.json(list);
}
