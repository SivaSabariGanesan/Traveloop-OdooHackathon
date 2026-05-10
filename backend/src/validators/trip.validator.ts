import { z } from 'zod';

export const createTripSchema = z.object({
  name: z.string().min(1, 'Trip name is required'),
  placeId: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  description: z.string().optional(),
  coverPhoto: z.string().optional(),
}).refine((data) => data.endDate >= data.startDate, {
  message: 'End date must be after or equal to start date',
  path: ['endDate'],
});

export const updateTripSchema = createTripSchema.partial();

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
