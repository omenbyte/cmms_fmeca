import { PrismaClient, Prisma } from '@prisma/client';
import { computeRpi } from './rpi';

export const prisma = new PrismaClient();

// Recompute RPI after a report is created
prisma.$use(async (params, next) => {
  const result = await next(params);

  if (params.model === Prisma.ModelName.Report && params.action === 'create') {
    const taskId = result.taskId as string;
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { fmecaRow: true }
    });
    if (task?.fmecaRow) {
      const { severity, occurrence, detection } = task.fmecaRow;
      const newRpi = computeRpi(severity, occurrence, detection);
      await prisma.fmecaRow.update({
        where: { id: task.fmecaRow.id },
        data: { rpi: newRpi }
      });
    }
  }
  return result;
});