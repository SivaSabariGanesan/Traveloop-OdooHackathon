import { tripRepo } from '../repositories/trip.repo';
import { AppError } from '../utils/AppError';
import type { CreateTripInput, UpdateTripInput } from '../validators/trip.validator';

const getStatus = (start: Date, end: Date): string => {
  const now = new Date();
  if (start > now) return 'UPCOMING';
  if (end < now) return 'COMPLETED';
  return 'ONGOING';
};

export const tripService = {
  getAll: async (userId: string) => {
    const trips = await tripRepo.findAllByUser(userId);
    return {
      ongoing: trips.filter((t) => t.status === 'ONGOING'),
      upcoming: trips.filter((t) => t.status === 'UPCOMING'),
      completed: trips.filter((t) => t.status === 'COMPLETED'),
    };
  },

  getById: async (userId: string, tripId: string) => {
    const trip = await tripRepo.findById(tripId);
    if (!trip) throw new AppError('Trip not found', 404);
    if (trip.userId !== userId) throw new AppError('Forbidden', 403);
    return trip;
  },

  create: async (userId: string, data: CreateTripInput) => {
    const status = getStatus(data.startDate, data.endDate);
    return tripRepo.create({ ...data, userId, status });
  },

  update: async (userId: string, tripId: string, data: UpdateTripInput) => {
    const trip = await tripRepo.findById(tripId);
    if (!trip) throw new AppError('Trip not found', 404);
    if (trip.userId !== userId) throw new AppError('Forbidden', 403);

    const updateData: any = { ...data };
    if (data.startDate || data.endDate) {
      const startDate = data.startDate || trip.startDate;
      const endDate = data.endDate || trip.endDate;
      updateData.status = getStatus(startDate, endDate);
    }

    return tripRepo.update(tripId, updateData);
  },

  delete: async (userId: string, tripId: string) => {
    const trip = await tripRepo.findById(tripId);
    if (!trip) throw new AppError('Trip not found', 404);
    if (trip.userId !== userId) throw new AppError('Forbidden', 403);
    return tripRepo.delete(tripId);
  },
};
