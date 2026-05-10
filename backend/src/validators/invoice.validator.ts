import { z } from 'zod';

export const upsertInvoiceSchema = z.object({
  totalBudget: z.number().min(0),
});

export const addInvoiceItemSchema = z.object({
  category: z.string().min(1),
  description: z.string().min(1),
  quantity: z.number().min(0.01),
  unitCost: z.number().min(0),
});

export const updateInvoiceItemSchema = addInvoiceItemSchema.partial();
