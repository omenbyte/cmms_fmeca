import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const roleParam = searchParams.get("role") as Role | null;  // "TECH" | "MANAGER" | null

  const users = await prisma.user.findMany({
    where: roleParam ? { role: roleParam } : {},              // no `any`
    select: { id: true, email: true },
  });

  return NextResponse.json(users);
}
