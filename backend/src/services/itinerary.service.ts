import { stopRepo, activityRepo } from '../repositories/itinerary.repo';
import { tripRepo } from '../repositories/trip.repo';
import { AppError } from '../utils/AppError';
import type {
  CreateStopInput,
  UpdateStopInput,
  ReorderStopsInput,
  CreateActivityInput,
  UpdateActivityInput,
  ReorderActivitiesInput,
} from '../validators/itinerary.validator';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Verify the trip exists and belongs to the requesting user */
async function assertTripOwnership(userId: string, tripId: string) {
  const trip = await tripRepo.findById(tripId);
  if (!trip) throw new AppError('Trip not found', 404);
  if (trip.userId !== userId) throw new AppError('Forbidden', 403);
  return trip;
}

/** Verify the stop exists and belongs to the requesting user (via trip) */
async function assertStopOwnership(userId: string, stopId: string) {
  const stop = await stopRepo.findByIdWithTrip(stopId);
  if (!stop) throw new AppError('Stop not found', 404);
  if (stop.trip.userId !== userId) throw new AppError('Forbidden', 403);
  return stop;
}

/** Verify the activity exists and belongs to the requesting user (via stop → trip) */
async function assertActivityOwnership(userId: string, activityId: string) {
  const activity = await activityRepo.findByIdWithStop(activityId);
  const stop = (activity as any)?.stop;
  if (!activity || !stop) throw new AppError('Activity not found', 404);
  if (stop.trip.userId !== userId) throw new AppError('Forbidden', 403);
  return activity;
}

// ─── Stop Service ─────────────────────────────────────────────────────────────

export const stopService = {
  getAll: async (userId: string, tripId: string) => {
    await assertTripOwnership(userId, tripId);
    return stopRepo.findAllByTrip(tripId);
  },

  getById: async (userId: string, stopId: string) => {
    return assertStopOwnership(userId, stopId);
  },

  create: async (userId: string, tripId: string, data: CreateStopInput) => {
    await assertTripOwnership(userId, tripId);

    // Auto-assign order if not provided: append at the end
    if (data.order === undefined) {
      const maxOrder = await stopRepo.getMaxOrder(tripId);
      data = { ...data, order: maxOrder + 1 };
    }

    return stopRepo.create(tripId, data);
  },

  update: async (userId: string, stopId: string, data: UpdateStopInput) => {
    await assertStopOwnership(userId, stopId);
    return stopRepo.update(stopId, data);
  },

  delete: async (userId: string, stopId: string) => {
    const stop = await assertStopOwnership(userId, stopId);
    await stopRepo.delete(stopId);

    // Re-normalize order for remaining stops after deletion
    const remaining = await stopRepo.findAllByTrip((stop as any).tripId);
    if (remaining.length > 0) {
      const reorderUpdates = remaining.map((s: { id: string }, idx: number) => ({ id: s.id, order: idx }));
      await stopRepo.reorder(reorderUpdates);
    }
  },

  reorder: async (userId: string, tripId: string, input: ReorderStopsInput) => {
    await assertTripOwnership(userId, tripId);

    // Verify all stop IDs belong to this trip
    const existing = await stopRepo.findAllByTrip(tripId);
    const existingIds = new Set(existing.map((s: { id: string }) => s.id));

    for (const { id } of input.stops) {
      if (!existingIds.has(id)) {
        throw new AppError(`Stop ${id} does not belong to this trip`, 400);
      }
    }

    await stopRepo.reorder(input.stops);
    return stopRepo.findAllByTrip(tripId);
  },
};

// ─── Activity Service ─────────────────────────────────────────────────────────

export const activityService = {
  getAll: async (userId: string, stopId: string) => {
    await assertStopOwnership(userId, stopId);
    return activityRepo.findAllByStop(stopId);
  },

  getById: async (userId: string, activityId: string) => {
    return assertActivityOwnership(userId, activityId);
  },

  create: async (userId: string, stopId: string, data: CreateActivityInput) => {
    await assertStopOwnership(userId, stopId);

    if (data.order === undefined) {
      const maxOrder = await activityRepo.getMaxOrder(stopId);
      data = { ...data, order: maxOrder + 1 };
    }

    return activityRepo.create(stopId, data);
  },

  update: async (userId: string, activityId: string, data: UpdateActivityInput) => {
    await assertActivityOwnership(userId, activityId);
    return activityRepo.update(activityId, data);
  },

  delete: async (userId: string, activityId: string) => {
    const activity = await assertActivityOwnership(userId, activityId);
    await activityRepo.delete(activityId);

    // Re-normalize order for remaining activities
    const stopId = (activity as any).stopId ?? (activity as any).stop?.id;
    if (stopId) {
      const remaining = await activityRepo.findAllByStop(stopId);
      if (remaining.length > 0) {
        const reorderUpdates = remaining.map((a, idx) => ({ id: a.id, order: idx }));
        await activityRepo.reorder(reorderUpdates);
      }
    }
  },

  reorder: async (userId: string, stopId: string, input: ReorderActivitiesInput) => {
    await assertStopOwnership(userId, stopId);

    const existing = await activityRepo.findAllByStop(stopId);
    const existingIds = new Set(existing.map((a) => a.id));

    for (const { id } of input.activities) {
      if (!existingIds.has(id)) {
        throw new AppError(`Activity ${id} does not belong to this stop`, 400);
      }
    }

    await activityRepo.reorder(input.activities);
    return activityRepo.findAllByStop(stopId);
  },
};
