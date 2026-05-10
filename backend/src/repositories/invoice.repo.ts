import { prisma } from '../config/db';

export const invoiceRepo = {
  findByTrip: (tripId: string) =>
    prisma.invoice.findUnique({
      where: { tripId },
      include: {
        items: true,
        trip: { select: { name: true, startDate: true, endDate: true } },
      },
    }),

  upsert: (tripId: string, totalBudget?: number) =>
    prisma.invoice.upsert({
      where: { tripId },
      create: { tripId, totalBudget: totalBudget ?? 0 },
      update: totalBudget !== undefined ? { totalBudget } : {},
      include: {
        items: { orderBy: { id: 'asc' } },
        trip: { select: { name: true, startDate: true, endDate: true } },
      },
    }),

  addItem: (
    invoiceId: string,
    data: {
      category: string;
      description: string;
      quantity: number;
      unitCost: number;
    }
  ) => {
    const amount = data.quantity * data.unitCost;
    return prisma.invoiceItem.create({
      data: { ...data, amount, invoiceId },
    });
  },

  updateItem: (id: string, data: any) => {
    const amount =
      data.quantity !== undefined && data.unitCost !== undefined
        ? data.quantity * data.unitCost
        : undefined;
    return prisma.invoiceItem.update({
      where: { id },
      data: {
        ...data,
        ...(amount !== undefined && { amount }),
      },
    });
  },

  deleteItem: (id: string) =>
    prisma.invoiceItem.delete({
      where: { id },
    }),

  findItemById: (id: string) =>
    prisma.invoiceItem.findUnique({
      where: { id },
      include: { invoice: true },
    }),

  markPaid: (tripId: string) =>
    prisma.invoice.update({
      where: { tripId },
      data: { status: 'PAID' },
    }),
};
