import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const highs = await prisma.failureMode.findMany({
    where: { rpi: { gte: 120 } },
    select: { id: true },
  });

  await Promise.all(
    highs.map((fm: { id: number }) =>
      prisma.workOrder.upsert({
        where: { fmId_status: { fmId: fm.id, status: "PENDING" } },
        update: {},
        create: { fmId: fm.id },
      })
    )
  );

  return NextResponse.json({ created: highs.length });
}
