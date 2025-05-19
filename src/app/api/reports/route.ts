// app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuid } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const taskId     = data.get('taskId')  as string;
  const symptoms   = data.get('symptoms') as string;
  const comments   = data.get('comments') as string;

  // handle images
  const images: string[] = [];
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });

  const files = data.getAll('images') as File[];
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = `${uuid()}-${file.name}`;
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    images.push(`/uploads/${filename}`);
  }

  // store report
  await prisma.report.create({
    data: {
      taskId,
      notes: `${symptoms}\n${comments}`,
      timeSpentMinutes: 0,
      imagesJson: JSON.stringify(images)
    }
  });

  return NextResponse.json({ ok: true });
}
