import { prisma } from '../config/db';
import type { CreateTripInput, UpdateTripInput } from '../validators/trip.validator';

export const tripRepo = {
  findAllByUser: (userId: string) =>
    prisma.trip.findMany({
      where: { userId },
      include: { sections: { include: { activities: true } } },
      orderBy: { createdAt: 'desc' },
    }),

  findById: (id: string) =>
    prisma.trip.findUnique({
      where: { id },
      include: { sections: { include: { activities: true } } },
    }),

  findPublic: (id: string) =>
    prisma.trip.findUnique({
      where: { id },
      include: {
        stops: {
          orderBy: { order: 'asc' },
          include: { activities: { orderBy: { order: 'asc' } } },
        },
        user: { select: { firstName: true, lastName: true } },
      },
    }),

  create: (data: CreateTripInput & { userId: string; status: string; coverPhoto?: string }) => {
    const { coverPhoto, ...rest } = data;
    return prisma.trip.create({
      data: coverPhoto ? { ...rest, coverPhoto } : rest,
    });
  },

  update: (id: string, data: UpdateTripInput) =>
    prisma.trip.update({ where: { id }, data }),

  delete: (id: string) =>
    prisma.trip.delete({ where: { id } }),
};
