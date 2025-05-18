import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET /api/work-orders   -> all WOs with FM & equipment */
export async function GET() {
  const wos = await prisma.workOrder.findMany({
    include: {
      failureMode: {
        include: { equipment: true },
      },
      assignedTo: true,
    },
    orderBy: { status: "asc" }, // PENDING first
  });
  return NextResponse.json(wos);
}

/** POST /api/work-orders { fmId:number }  -> create WO if not exists */
export async function POST(req: Request) {
  const { fmId } = await req.json();
  const existing = await prisma.workOrder.findFirst({
    where: { failureModeId: fmId, status: "PENDING" },
  });
  if (existing) return NextResponse.json(existing);

  const wo = await prisma.workOrder.create({
    data: { failureModeId: fmId },
    include: { failureMode: { include: { equipment: true } } },
  });
  return NextResponse.json(wo, { status: 201 });
}
