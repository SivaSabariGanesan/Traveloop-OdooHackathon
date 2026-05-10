import { prisma } from '../config/db';

export const communityRepo = {
  findAll: (page: number, limit: number) =>
    prisma.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    }),

  count: () => prisma.post.count(),

  findById: (id: string) =>
    prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    }),

  create: (userId: string, data: { body: string; imageUrl?: string }) =>
    prisma.post.create({
      data: { ...data, userId },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    }),

  incrementLikes: (id: string) =>
    prisma.post.update({
      where: { id },
      data: { likes: { increment: 1 } },
    }),

  delete: (id: string) =>
    prisma.post.delete({
      where: { id },
    }),
};
