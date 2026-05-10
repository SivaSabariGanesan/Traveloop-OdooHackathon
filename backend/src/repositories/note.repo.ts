import { prisma } from '../config/db';

export const noteRepo = {
  findAllByTrip: (tripId: string) =>
    prisma.note.findMany({
      where: { tripId },
      orderBy: { createdAt: 'desc' },
    }),

  findById: (id: string) =>
    prisma.note.findUnique({
      where: { id },
    }),

  create: (data: {
    title: string;
    body: string;
    bookmarked: boolean;
    tripId: string;
    userId: string;
  }) =>
    prisma.note.create({
      data,
    }),

  update: (
    id: string,
    data: Partial<{ title: string; body: string; bookmarked: boolean }>
  ) =>
    prisma.note.update({
      where: { id },
      data,
    }),

  delete: (id: string) =>
    prisma.note.delete({
      where: { id },
    }),
};
