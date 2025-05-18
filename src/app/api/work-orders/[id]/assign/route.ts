import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _: Request,
  { params }: { params: { id: string } }
) {
  const { techId } = await _.json();
  const wo = await prisma.workOrder.update({
    where: { id: Number(params.id) },
    data: { assignedToId: techId },
    include: { assignedTo: true },
  });
  return NextResponse.json(wo);
}
