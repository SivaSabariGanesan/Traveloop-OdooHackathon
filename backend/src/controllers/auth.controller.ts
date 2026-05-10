import type { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { userRepo } from '../repositories/user.repo';
import type { AuthRequest } from '../middlewares/auth';
import { AppError } from '../utils/AppError';

export const authController = {
  /**
   * Verify email with token
   */
  verifyEmail: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.query;
      if (!token || typeof token !== 'string') throw new AppError('Token is required', 400);

      const result = await authService.verifyEmail(token);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Resend verification email
   */
  resendVerification: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== 'string') throw new AppError('Email is required', 400);

      const result = await authService.resendVerification(email.toLowerCase().trim());
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Register a new user
   */
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Login user
   */
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(req.body);
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshAccessToken(refreshToken);
      
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);

      const user = await userRepo.findById(req.user.id);
      if (!user) throw new AppError('User not found', 404);

      const { password, ...safeUser } = user;

      res.status(200).json({
        status: 'success',
        data: { user: safeUser },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update current user profile
   */
  updateProfile: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);

      const updatedUser = await userRepo.update(req.user.id, req.body);
      const { password, ...safeUser } = updatedUser;

      res.status(200).json({
        status: 'success',
        data: { user: safeUser },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete current user account
   */
  deleteAccount: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);

      await userRepo.delete(req.user.id);

      res.status(200).json({
        status: 'success',
        message: 'Account deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
