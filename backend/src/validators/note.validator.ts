import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  body: z.string().min(1, 'Body is required'),
  bookmarked: z.boolean().optional().default(false),
});

export const updateNoteSchema = createNoteSchema.partial();
