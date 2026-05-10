import type { Response, NextFunction } from 'express';
import { checklistService } from '../services/checklist.service';
import { sendSuccess } from '../utils/apiResponse';
import type { AuthRequest } from '../middlewares/auth';

export const checklistController = {
  get: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await checklistService.getOrCreate(
        req.params.tripId,
        req.user!.id
      );
      sendSuccess(res, data);
    } catch (e) {
      next(e);
    }
  },

  addItem: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await checklistService.addItem(
        req.params.tripId,
        req.user!.id,
        req.body
      );
      sendSuccess(res, data, 201);
    } catch (e) {
      next(e);
    }
  },

  toggleItem: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await checklistService.toggleItem(
        req.user!.id,
        req.params.itemId,
        req.body.checked
      );
      sendSuccess(res, data);
    } catch (e) {
      next(e);
    }
  },

  updateItem: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await checklistService.updateItem(
        req.user!.id,
        req.params.itemId,
        req.body
      );
      sendSuccess(res, data);
    } catch (e) {
      next(e);
    }
  },

  deleteItem: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await checklistService.deleteItem(req.user!.id, req.params.itemId);
      sendSuccess(res, { message: 'Item deleted' });
    } catch (e) {
      next(e);
    }
  },

  resetAll: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await checklistService.resetAll(req.params.tripId, req.user!.id);
      sendSuccess(res, { message: 'Checklist reset' });
    } catch (e) {
      next(e);
    }
  },
};
