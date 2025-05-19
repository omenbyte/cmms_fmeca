import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay } from 'date-fns';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const today = searchParams.get('today');

  if (today !== null) {
    const now = new Date();
    const tasks = await prisma.task.findMany({
      where: {
        createdAt: { gte: startOfDay(now), lte: endOfDay(now) }
      },
      include: { fmecaRow: true },
      orderBy: [
        { priority: 'desc' },
        { fmecaRow: { rpi: 'desc' } }
      ]
    });
    return NextResponse.json(tasks);
  }

  return NextResponse.json({ error: 'Unsupported query' }, { status: 400 });
}