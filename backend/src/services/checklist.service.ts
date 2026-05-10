import { checklistRepo } from '../repositories/checklist.repo';
import { AppError } from '../utils/AppError';

export const checklistService = {
  getOrCreate: (tripId: string, userId: string) =>
    checklistRepo.upsert(tripId, userId),

  addItem: async (tripId: string, userId: string, data: any) => {
    const checklist = await checklistRepo.upsert(tripId, userId);
    return checklistRepo.addItem(checklist.id, data);
  },

  toggleItem: async (userId: string, itemId: string, checked: boolean) => {
    const item = await checklistRepo.findItemById(itemId);
    if (!item) throw new AppError('Item not found', 404);
    if (item.checklist.userId !== userId) throw new AppError('Forbidden', 403);
    return checklistRepo.toggleItem(itemId, checked);
  },

  updateItem: async (userId: string, itemId: string, data: any) => {
    const item = await checklistRepo.findItemById(itemId);
    if (!item) throw new AppError('Item not found', 404);
    if (item.checklist.userId !== userId) throw new AppError('Forbidden', 403);
    return checklistRepo.updateItem(itemId, data);
  },

  deleteItem: async (userId: string, itemId: string) => {
    const item = await checklistRepo.findItemById(itemId);
    if (!item) throw new AppError('Item not found', 404);
    if (item.checklist.userId !== userId) throw new AppError('Forbidden', 403);
    return checklistRepo.deleteItem(itemId);
  },

  resetAll: async (tripId: string, userId: string) => {
    const checklist = await checklistRepo.findByTrip(tripId);
    if (!checklist) throw new AppError('Checklist not found', 404);
    if (checklist.userId !== userId) throw new AppError('Forbidden', 403);
    return checklistRepo.resetAll(checklist.id);
  },
};
