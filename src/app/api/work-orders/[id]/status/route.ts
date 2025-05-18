import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { status } = await req.json(); // "COMPLETED" | "ARCHIVED"
  const wo = await prisma.workOrder.update({
    where: { id: Number(params.id) },
    data: { status },
  });
  return NextResponse.json(wo);
}
