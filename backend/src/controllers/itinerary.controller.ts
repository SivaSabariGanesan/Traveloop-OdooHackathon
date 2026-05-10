import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middlewares/auth';
import { stopService, activityService } from '../services/itinerary.service';
import { AppError } from '../utils/AppError';

// ─── Stop Controller ──────────────────────────────────────────────────────────

export const stopController = {
  getAll: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);
      const stops = await stopService.getAll(req.user.id, req.params.tripId);
      res.status(200).json({ status: 'success', data: stops });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);
      const stop = await stopService.getById(req.user.id, req.params.stopId);
      res.status(200).json({ status: 'success', data: stop });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);
      const stop = await stopService.create(req.user.id, req.params.tripId, req.body);
      res.status(201).json({ status: 'success', data: stop });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);
      const stop = await stopService.update(req.user.id, req.params.stopId, req.body);
      res.status(200).json({ status: 'success', data: stop });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);
      await stopService.delete(req.user.id, req.params.stopId);
      res.status(200).json({ status: 'success', message: 'Stop deleted successfully' });
    } catch (err) {
      next(err);
    }
  },

  reorder: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);
      const stops = await stopService.reorder(req.user.id, req.params.tripId, req.body);
      res.status(200).json({ status: 'success', data: stops });
    } catch (err) {
      next(err);
    }
  },
};

// ─── Activity Controller ──────────────────────────────────────────────────────

export const activityController = {
  getAll: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);
      const activities = await activityService.getAll(req.user.id, req.params.stopId);
      res.status(200).json({ status: 'success', data: activities });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);
      const activity = await activityService.getById(req.user.id, req.params.activityId);
      res.status(200).json({ status: 'success', data: activity });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);
      const activity = await activityService.create(req.user.id, req.params.stopId, req.body);
      res.status(201).json({ status: 'success', data: activity });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);
      const activity = await activityService.update(req.user.id, req.params.activityId, req.body);
      res.status(200).json({ status: 'success', data: activity });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);
      await activityService.delete(req.user.id, req.params.activityId);
      res.status(200).json({ status: 'success', message: 'Activity deleted successfully' });
    } catch (err) {
      next(err);
    }
  },

  reorder: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);
      const activities = await activityService.reorder(req.user.id, req.params.stopId, req.body);
      res.status(200).json({ status: 'success', data: activities });
    } catch (err) {
      next(err);
    }
  },
};
