import { z } from 'zod';

// ─── Stop Validators ──────────────────────────────────────────────────────────

export const createStopSchema = z
  .object({
    city: z.string().min(1, 'City is required'),
    country: z.string().optional(),
    placeId: z.string().optional(),
    arrivalDate: z.coerce.date(),
    departureDate: z.coerce.date(),
    notes: z.string().optional(),
    order: z.coerce.number().int().min(0).optional(),
  })
  .refine((d) => d.departureDate >= d.arrivalDate, {
    message: 'Departure date must be on or after arrival date',
    path: ['departureDate'],
  });

export const updateStopSchema = z
  .object({
    city: z.string().min(1).optional(),
    country: z.string().optional(),
    placeId: z.string().optional(),
    arrivalDate: z.coerce.date().optional(),
    departureDate: z.coerce.date().optional(),
    notes: z.string().optional(),
    order: z.coerce.number().int().min(0).optional(),
  })
  .refine(
    (d) => {
      if (d.arrivalDate && d.departureDate) return d.departureDate >= d.arrivalDate;
      return true;
    },
    { message: 'Departure date must be on or after arrival date', path: ['departureDate'] }
  );

export const reorderStopsSchema = z.object({
  // Array of { id, order } pairs
  stops: z
    .array(
      z.object({
        id: z.string().min(1),
        order: z.number().int().min(0),
      })
    )
    .min(1, 'At least one stop is required'),
});

// ─── Activity Validators ──────────────────────────────────────────────────────

export const createActivitySchema = z.object({
  name: z.string().min(1, 'Activity name is required'),
  description: z.string().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  location: z.string().optional(),
  cost: z.coerce.number().min(0).optional(),
  order: z.coerce.number().int().min(0).optional(),
});

export const updateActivitySchema = createActivitySchema.partial();

export const reorderActivitiesSchema = z.object({
  activities: z
    .array(
      z.object({
        id: z.string().min(1),
        order: z.number().int().min(0),
      })
    )
    .min(1, 'At least one activity is required'),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type CreateStopInput = z.infer<typeof createStopSchema>;
export type UpdateStopInput = z.infer<typeof updateStopSchema>;
export type ReorderStopsInput = z.infer<typeof reorderStopsSchema>;
export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;
export type ReorderActivitiesInput = z.infer<typeof reorderActivitiesSchema>;
