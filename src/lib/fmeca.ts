import { prisma } from "@/lib/prisma";
import { computeRpi } from "@/lib/rpi";

export async function updateScoresAndMaybeCreateWO(
  fmId: number,
  s: number,
  o: number,
  d: number
) {
  const rpi = computeRpi(s, o, d);

  // 1. update FailureMode row
  const fm = await prisma.failureMode.update({
    where: { id: fmId },
    data: { severity: s, occurrence: o, detectability: d, rpi },
  });

  // 2. add history
  await prisma.fmeaHistory.create({
    data: { fmId, severity: s, occurrence: o, detectability: d, rpi },
  });

  // 3. if critical, upsert a pending Work‑Order
  if (rpi >= 120) {
    await prisma.workOrder.upsert({
      where: { fmId_status: { fmId, status: "PENDING" } }, // composite uniq constraint later
      update: {},
      create: { fmId },
    });
  }

  return fm;
}
