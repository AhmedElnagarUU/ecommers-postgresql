import type { Prisma } from '../generated/prisma/client';

export async function generateOrderNumber(
  tx: Prisma.TransactionClient
): Promise<string> {
  const latest = await tx.order.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { orderNumber: true },
  });

  const latestNumber = latest?.orderNumber?.match(/^ORD(\d+)$/)?.[1];
  const next = latestNumber ? Number.parseInt(latestNumber, 10) + 1 : 1;
  return `ORD${String(next).padStart(6, '0')}`;
}
