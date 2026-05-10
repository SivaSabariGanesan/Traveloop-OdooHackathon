import type { Response, NextFunction } from 'express';
import { noteService } from '../services/note.service';
import { sendSuccess } from '../utils/apiResponse';
import type { AuthRequest } from '../middlewares/auth';

export const noteController = {
  getAll: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await noteService.getAll(req.params.tripId);
      sendSuccess(res, data);
    } catch (e) {
      next(e);
    }
  },

  create: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await noteService.create(
        req.user!.id,
        req.params.tripId,
        req.body
      );
      sendSuccess(res, data, 201);
    } catch (e) {
      next(e);
    }
  },

  update: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await noteService.update(
        req.user!.id,
        req.params.noteId,
        req.body
      );
      sendSuccess(res, data);
    } catch (e) {
      next(e);
    }
  },

  delete: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await noteService.delete(req.user!.id, req.params.noteId);
      sendSuccess(res, { message: 'Note deleted' });
    } catch (e) {
      next(e);
    }
  },

  toggleBookmark: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await noteService.toggleBookmark(
        req.user!.id,
        req.params.noteId
      );
      sendSuccess(res, data);
    } catch (e) {
      next(e);
    }
  },
};
