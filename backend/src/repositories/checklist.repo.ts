import { prisma } from '../config/db';

export const checklistRepo = {
  findByTrip: (tripId: string) =>
    prisma.checklist.findUnique({
      where: { tripId },
      include: { items: { orderBy: { category: 'asc' } } },
    }),

  upsert: (tripId: string, userId: string) =>
    prisma.checklist.upsert({
      where: { tripId },
      create: { tripId, userId },
      update: {},
      include: { items: true },
    }),

  addItem: (checklistId: string, data: { label: string; category?: string }) =>
    prisma.checklistItem.create({
      data: { ...data, checklistId },
    }),

  toggleItem: (id: string, checked: boolean) =>
    prisma.checklistItem.update({
      where: { id },
      data: { checked },
    }),

  updateItem: (id: string, data: Partial<{ label: string; category: string }>) =>
    prisma.checklistItem.update({
      where: { id },
      data,
    }),

  deleteItem: (id: string) =>
    prisma.checklistItem.delete({
      where: { id },
    }),

  findItemById: (id: string) =>
    prisma.checklistItem.findUnique({
      where: { id },
      include: { checklist: true },
    }),

  resetAll: (checklistId: string) =>
    prisma.checklistItem.updateMany({
      where: { checklistId },
      data: { checked: false },
    }),
};
