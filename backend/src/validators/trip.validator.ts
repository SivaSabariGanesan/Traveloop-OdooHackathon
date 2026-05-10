import { z } from 'zod';

const baseTripSchema = z.object({
  name: z.string().min(1, 'Trip name is required'),
  destination: z.string().optional(),
  budget: z.coerce.number().positive('Budget must be a positive number').optional(),
  placeId: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  description: z.string().optional(),
  // coverPhoto is handled via file upload, not body
});

export const createTripSchema = baseTripSchema.refine(
  (data) => data.endDate >= data.startDate,
  {
    message: 'End date must be after or equal to start date',
    path: ['endDate'],
  }
);

export const updateTripSchema = baseTripSchema.partial().refine(
  (data) => {
    // Only validate dates if both are provided
    if (data.startDate && data.endDate) {
      return data.endDate >= data.startDate;
    }
    return true;
  },
  {
    message: 'End date must be after or equal to start date',
    path: ['endDate'],
  }
);

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
