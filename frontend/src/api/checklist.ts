import api from './axios';

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  category: string;
  checklistId: string;
}

export interface Checklist {
  id: string;
  tripId: string;
  userId: string;
  items: ChecklistItem[];
}

export interface CreateItemPayload {
  label: string;
  category?: string;
}

export interface UpdateItemPayload {
  label?: string;
  category?: string;
}

export const checklistApi = {
  /** GET /api/trips/:tripId/checklist */
  getOrCreate: (tripId: string) =>
    api.get<{ status: string; data: Checklist }>(`/trips/${tripId}/checklist`),

  /** POST /api/trips/:tripId/checklist/items */
  addItem: (tripId: string, payload: CreateItemPayload) =>
    api.post<{ status: string; data: ChecklistItem }>(`/trips/${tripId}/checklist/items`, payload),

  /** PATCH /api/trips/:tripId/checklist/items/:itemId */
  toggleItem: (tripId: string, itemId: string, checked: boolean) =>
    api.patch<{ status: string; data: ChecklistItem }>(`/trips/${tripId}/checklist/items/${itemId}`, { checked }),

  /** PUT /api/trips/:tripId/checklist/items/:itemId */
  updateItem: (tripId: string, itemId: string, payload: UpdateItemPayload) =>
    api.put<{ status: string; data: ChecklistItem }>(`/trips/${tripId}/checklist/items/${itemId}`, payload),

  /** DELETE /api/trips/:tripId/checklist/items/:itemId */
  deleteItem: (tripId: string, itemId: string) =>
    api.delete(`/trips/${tripId}/checklist/items/${itemId}`),

  /** POST /api/trips/:tripId/checklist/reset */
  resetAll: (tripId: string) =>
    api.post(`/trips/${tripId}/checklist/reset`),
};
