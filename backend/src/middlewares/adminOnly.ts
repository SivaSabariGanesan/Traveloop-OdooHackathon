import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth';
import { AppError } from '../utils/AppError';

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    if (req.user.role !== 'ADMIN') {
      throw new AppError('Admin access required', 403);
    }

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};
