import type { Response, NextFunction } from 'express';
import { communityService } from '../services/community.service';
import { sendSuccess } from '../utils/apiResponse';
import type { AuthRequest } from '../middlewares/auth';

export const communityController = {
  getAll: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const data = await communityService.getPosts(page, limit);
      sendSuccess(res, data);
    } catch (e) {
      next(e);
    }
  },

  create: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await communityService.create(req.user!.id, req.body);
      sendSuccess(res, data, 201);
    } catch (e) {
      next(e);
    }
  },

  like: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await communityService.like(req.params.postId);
      sendSuccess(res, data);
    } catch (e) {
      next(e);
    }
  },

  delete: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await communityService.delete(req.user!.id, req.params.postId);
      sendSuccess(res, { message: 'Post deleted' });
    } catch (e) {
      next(e);
    }
  },
};
