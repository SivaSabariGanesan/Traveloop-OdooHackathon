import { invoiceRepo } from '../repositories/invoice.repo';
import { AppError } from '../utils/AppError';
import { generateInvoicePDF } from '../utils/pdfExport';
import { emailService } from './email.service';
import { tripRepo } from '../repositories/trip.repo';
import { userRepo } from '../repositories/user.repo';

export const invoiceService = {
  getOrCreate: (tripId: string, totalBudget?: number) =>
    invoiceRepo.upsert(tripId, totalBudget),

  get: async (tripId: string) => {
    return invoiceRepo.upsert(tripId);
  },

  setBudget: (tripId: string, totalBudget: number) =>
    invoiceRepo.upsert(tripId, totalBudget),

  addItem: async (tripId: string, data: any) => {
    const invoice = await invoiceRepo.upsert(tripId);
    return invoiceRepo.addItem(invoice.id, data);
  },

  updateItem: async (userId: string, itemId: string, data: any) => {
    const item = await invoiceRepo.findItemById(itemId);
    if (!item) throw new AppError('Item not found', 404);
    const trip = await tripRepo.findById(item.invoice.tripId);
    if (!trip || trip.userId !== userId) throw new AppError('Forbidden', 403);
    return invoiceRepo.updateItem(itemId, data);
  },

  deleteItem: async (userId: string, itemId: string) => {
    const item = await invoiceRepo.findItemById(itemId);
    if (!item) throw new AppError('Item not found', 404);
    const trip = await tripRepo.findById(item.invoice.tripId);
    if (!trip || trip.userId !== userId) throw new AppError('Forbidden', 403);
    return invoiceRepo.deleteItem(itemId);
  },

  markPaid: async (userId: string, tripId: string) => {
    const trip = await tripRepo.findById(tripId);
    if (!trip || trip.userId !== userId) throw new AppError('Forbidden', 403);
    return invoiceRepo.markPaid(tripId);
  },

  exportPDF: async (userId: string, tripId: string): Promise<Buffer> => {
    const trip = await tripRepo.findById(tripId);
    if (!trip || trip.userId !== userId) throw new AppError('Forbidden', 403);
    const invoice = await invoiceRepo.findByTrip(tripId);
    if (!invoice) throw new AppError('Invoice not found', 404);
    return generateInvoicePDF(invoice);
  },

  emailInvoice: async (userId: string, tripId: string): Promise<void> => {
    const trip = await tripRepo.findById(tripId);
    if (!trip || trip.userId !== userId) throw new AppError('Forbidden', 403);
    const invoice = await invoiceRepo.findByTrip(tripId);
    if (!invoice) throw new AppError('Invoice not found', 404);
    const user = await userRepo.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    const pdfBuffer = await generateInvoicePDF(invoice);
    await emailService.sendInvoice(user.email, trip.name, pdfBuffer);
  },
};
