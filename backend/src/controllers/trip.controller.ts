import type { Response, NextFunction } from 'express';
import { tripService } from '../services/trip.service';
import type { AuthRequest } from '../middlewares/auth';
import { AppError } from '../utils/AppError';

export const tripController = {
  /**
   * Get all trips for the authenticated user
   */
  getAll: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);

      const trips = await tripService.getAll(req.user.id);

      res.status(200).json({
        status: 'success',
        data: trips,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get a single trip by ID
   */
  getById: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);
      if (!req.params.id) throw new AppError('Trip ID is required', 400);

      const trip = await tripService.getById(req.user.id, req.params.id);

      res.status(200).json({
        status: 'success',
        data: { trip },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create a new trip
   */
  create: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);

      const trip = await tripService.create(req.user.id, req.body);

      res.status(201).json({
        status: 'success',
        data: { trip },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update a trip
   */
  update: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);
      if (!req.params.id) throw new AppError('Trip ID is required', 400);

      const trip = await tripService.update(req.user.id, req.params.id, req.body);

      res.status(200).json({
        status: 'success',
        data: { trip },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete a trip
   */
  delete: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);
      if (!req.params.id) throw new AppError('Trip ID is required', 400);

      await tripService.delete(req.user.id, req.params.id);

      res.status(200).json({
        status: 'success',
        message: 'Trip deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
