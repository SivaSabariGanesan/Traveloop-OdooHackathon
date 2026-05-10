import type { Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service';
import { sendSuccess } from '../utils/apiResponse';
import type { AuthRequest } from '../middlewares/auth';
import { AppError } from '../utils/AppError';

export const adminController = {
  getDashboardStats: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user!.role !== 'ADMIN') {
        throw new AppError('Forbidden: Admin access required', 403);
      }
      const data = await adminService.getDashboardStats();
      sendSuccess(res, data);
    } catch (e) {
      next(e);
    }
  },

  getUsers: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user!.role !== 'ADMIN') {
        throw new AppError('Forbidden: Admin access required', 403);
      }
      const data = await adminService.getUsers();
      sendSuccess(res, data);
    } catch (e) {
      next(e);
    }
  },

  updateUserRole: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user!.role !== 'ADMIN') {
        throw new AppError('Forbidden: Admin access required', 403);
      }
      const { role } = req.body;
      if (!['USER', 'ADMIN'].includes(role)) {
        throw new AppError('Invalid role', 400);
      }
      const data = await adminService.updateUserRole(req.params.userId as string, role);
      sendSuccess(res, data);
    } catch (e) {
      next(e);
    }
  },
};
