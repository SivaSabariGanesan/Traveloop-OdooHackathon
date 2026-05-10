import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.string().min(1, 'Post body is required').max(2000),
  imageUrl: z.string().url().optional(),
});
