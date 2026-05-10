import { prisma } from '../config/db';
import type {
  CreateStopInput,
  UpdateStopInput,
  CreateActivityInput,
  UpdateActivityInput,
} from '../validators/itinerary.validator';

// ─── Stop Repository ──────────────────────────────────────────────────────────

export const stopRepo = {
  findAllByTrip: (tripId: string) =>
    prisma.stop.findMany({
      where: { tripId },
      include: { activities: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    }),

  findById: (id: string) =>
    prisma.stop.findUnique({
      where: { id },
      include: { activities: { orderBy: { order: 'asc' } } },
    }),

  findByIdWithTrip: (id: string) =>
    prisma.stop.findUnique({
      where: { id },
      include: { trip: true, activities: { orderBy: { order: 'asc' } } },
    }),

  create: (tripId: string, data: CreateStopInput) => {
    const { order, ...rest } = data;
    return prisma.stop.create({
      data: { ...rest, tripId, order: order ?? 0 },
      include: { activities: true },
    });
  },

  update: (id: string, data: UpdateStopInput) =>
    prisma.stop.update({
      where: { id },
      data,
      include: { activities: { orderBy: { order: 'asc' } } },
    }),

  delete: (id: string) => prisma.stop.delete({ where: { id } }),

  // Bulk update orders in a transaction
  reorder: (updates: { id: string; order: number }[]) =>
    prisma.$transaction(
      updates.map(({ id, order }) =>
        prisma.stop.update({ where: { id }, data: { order } })
      )
    ),

  // Get max order value for a trip (to append new stops at the end)
  getMaxOrder: async (tripId: string): Promise<number> => {
    const result = await prisma.stop.aggregate({
      where: { tripId },
      _max: { order: true },
    });
    return result._max.order ?? -1;
  },
};

// ─── Activity Repository ──────────────────────────────────────────────────────

export const activityRepo = {
  findAllByStop: (stopId: string) =>
    prisma.activity.findMany({
      where: { stopId },
      orderBy: { order: 'asc' },
    }),

  findById: (id: string) => prisma.activity.findUnique({ where: { id } }),

  findByIdWithStop: (id: string) =>
    prisma.activity.findUnique({
      where: { id },
      include: { stop: { include: { trip: true } } },
    }),

  create: (stopId: string, data: CreateActivityInput) => {
    const { order, ...rest } = data;
    return prisma.activity.create({
      data: { ...rest, stopId, order: order ?? 0 },
    });
  },

  update: (id: string, data: UpdateActivityInput) =>
    prisma.activity.update({ where: { id }, data }),

  delete: (id: string) => prisma.activity.delete({ where: { id } }),

  reorder: (updates: { id: string; order: number }[]) =>
    prisma.$transaction(
      updates.map(({ id, order }) =>
        prisma.activity.update({ where: { id }, data: { order } })
      )
    ),

  getMaxOrder: async (stopId: string): Promise<number> => {
    const result = await prisma.activity.aggregate({
      where: { stopId },
      _max: { order: true },
    });
    return result._max.order ?? -1;
  },
};
