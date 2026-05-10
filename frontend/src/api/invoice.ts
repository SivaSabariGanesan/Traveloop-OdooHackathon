import api from './axios';

export interface InvoiceItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unitCost: number;
  amount: number;
  invoiceId: string;
}

export interface TripMinimal {
  name: string;
  startDate: string;
  endDate: string;
}

export interface InvoiceData {
  id: string;
  tripId: string;
  totalBudget: number;
  status: 'PENDING' | 'PAID';
  createdAt: string;
  items: InvoiceItem[];
  trip: TripMinimal;
}

export const invoiceApi = {
  getInvoice: (tripId: string) =>
    api.get<{ status: string; data: InvoiceData }>(`/trips/${tripId}/invoice`),

  setBudget: (tripId: string, totalBudget: number) =>
    api.put<{ status: string; data: InvoiceData }>(`/trips/${tripId}/invoice`, { totalBudget }),

  addItem: (tripId: string, item: Omit<InvoiceItem, 'id' | 'amount' | 'invoiceId'>) =>
    api.post<{ status: string; data: InvoiceItem }>(`/trips/${tripId}/invoice/items`, item),

  updateItem: (tripId: string, itemId: string, item: Partial<Omit<InvoiceItem, 'id' | 'amount' | 'invoiceId'>>) =>
    api.patch<{ status: string; data: InvoiceItem }>(`/trips/${tripId}/invoice/items/${itemId}`, item),

  deleteItem: (tripId: string, itemId: string) =>
    api.delete<{ status: string }>(`/trips/${tripId}/invoice/items/${itemId}`),

  markPaid: (tripId: string) =>
    api.patch<{ status: string; data: InvoiceData }>(`/trips/${tripId}/invoice/status/paid`),

  exportPDFUrl: (tripId: string) =>
    `http://localhost:5000/api/trips/${tripId}/invoice/export/pdf`, // Usually handle via window.open
};
