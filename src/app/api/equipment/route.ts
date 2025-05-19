// app/api/equipment/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const data = await prisma.equipment.findMany({
    include: { fmecaRows: { select: { rpi: true } } }
  });
  // compute worst RPI per equipment
  const result = data.map(e => ({
    id: e.id,
    name: e.name,
    maxRpi: Math.max(...e.fmecaRows.map(r => r.rpi))
  }));
  return NextResponse.json(result);
}
