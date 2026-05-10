import type { Response, NextFunction } from 'express';
import { invoiceService } from '../services/invoice.service';
import { sendSuccess } from '../utils/apiResponse';
import type { AuthRequest } from '../middlewares/auth';
import { prisma } from '../config/db';
import { AppError } from '../utils/AppError';

export const invoiceController = {
  get: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await invoiceService.get(req.params.tripId);
      sendSuccess(res, data);
    } catch (e) {
      next(e);
    }
  },

  setBudget: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await invoiceService.setBudget(
        req.params.tripId,
        req.body.totalBudget
      );
      sendSuccess(res, data);
    } catch (e) {
      next(e);
    }
  },

  addItem: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await invoiceService.addItem(req.params.tripId, req.body);
      sendSuccess(res, data, 201);
    } catch (e) {
      next(e);
    }
  },

  updateItem: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await invoiceService.updateItem(
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
      await invoiceService.deleteItem(req.user!.id, req.params.itemId);
      sendSuccess(res, { message: 'Item deleted' });
    } catch (e) {
      next(e);
    }
  },

  markPaid: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await invoiceService.markPaid(req.user!.id, req.params.tripId);
      sendSuccess(res, data);
    } catch (e) {
      next(e);
    }
  },

  exportPDF: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const pdf = await invoiceService.exportPDF(req.user!.id, req.params.tripId);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=invoice-${req.params.tripId}.pdf`
      );
      res.end(pdf);
    } catch (e) {
      next(e);
    }
  },

  sendEmail: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Fetch user email from database using authenticated user ID
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: { email: true },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      await invoiceService.emailInvoice(req.user!.id, req.params.tripId);
      sendSuccess(res, { message: 'Invoice sent to your email' });
    } catch (e) {
      next(e);
    }
  },
};
