import { prisma } from '../config/db';

export const adminService = {
  getDashboardStats: async () => {
    // 1. Total Users
    const totalUsers = await prisma.user.count();

    // 2. Total Trips
    const totalTrips = await prisma.trip.count();

    // 3. Trip Status Breakdown
    const tripsByStatus = await prisma.trip.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    // 4. Top Destinations (from Stops)
    const topStops = await prisma.stop.groupBy({
      by: ['city'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 5,
    });

    // 5. Recent Users
    const recentUsers = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    // 6. Recent Trips
    const recentTrips = await prisma.trip.findMany({
      select: {
        id: true,
        name: true,
        destination: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    return {
      totalUsers,
      totalTrips,
      tripsByStatus: tripsByStatus.map(t => ({
        status: t.status,
        count: t._count.id,
      })),
      topCities: topStops.map(s => ({
        city: s.city,
        visits: s._count.id,
      })),
      recentUsers,
      recentTrips,
    };
  },

  getUsers: async () => {
    return prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { trips: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  updateUserRole: async (userId: string, role: 'USER' | 'ADMIN') => {
    return prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        firstName: true,
        email: true,
        role: true,
      },
    });
  },
};
