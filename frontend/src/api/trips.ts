import api from './axios';

export interface Trip {
  id: string;
  name: string;
  destination?: string;
  budget?: number;
  startDate: string;
  endDate: string;
  description?: string;
  coverPhoto?: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  createdAt?: string;
  updatedAt?: string;
}

export interface TripsData {
  ongoing: Trip[];
  upcoming: Trip[];
  completed: Trip[];
}

export const tripsApi = {
  getAll: () => api.get<{ status: string; data: TripsData }>('/trips'),

  getById: (id: string) => api.get<{ status: string; data: { trip: Trip } }>(`/trips/${id}`),

  create: (formData: FormData) =>
    api.post<{ status: string; data: { trip: Trip } }>('/trips', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, data: Partial<Trip>) =>
    api.patch<{ status: string; data: { trip: Trip } }>(`/trips/${id}`, data),

  delete: (id: string) => api.delete(`/trips/${id}`),

  getPublic: (id: string) =>
    api.get<{ status: string; data: { trip: Trip & { stops: import('./itinerary').Stop[]; user: { firstName: string; lastName: string } } } }>(`/trips/${id}/public`),
};
