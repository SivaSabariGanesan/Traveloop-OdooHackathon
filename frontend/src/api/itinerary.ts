import api from './axios';

export interface Stop {
  id: string;
  tripId: string;
  city: string;
  country?: string;
  arrivalDate: string;
  departureDate: string;
  order: number;
  notes?: string;
  activities: Activity[];
}

export interface Activity {
  id: string;
  stopId: string;
  name: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  cost?: number;
  order: number;
}

export const itineraryApi = {
  // Stops
  getStops: (tripId: string) =>
    api.get<{ status: string; data: Stop[] }>(`/trips/${tripId}/stops`),

  createStop: (tripId: string, data: { city: string; arrivalDate: string; departureDate: string; country?: string; notes?: string; order?: number }) =>
    api.post<{ status: string; data: Stop }>(`/trips/${tripId}/stops`, data),

  updateStop: (tripId: string, stopId: string, data: Partial<Stop> | Record<string, unknown>) =>
    api.patch<{ status: string; data: Stop }>(`/trips/${tripId}/stops/${stopId}`, data),

  deleteStop: (tripId: string, stopId: string) =>
    api.delete(`/trips/${tripId}/stops/${stopId}`),

  reorderStops: (tripId: string, stops: { id: string; order: number }[]) =>
    api.patch<{ status: string; data: Stop[] }>(`/trips/${tripId}/stops/reorder`, { stops }),

  // Activities
  createActivity: (tripId: string, stopId: string, data: Omit<Activity, 'id' | 'stopId'>) =>
    api.post<{ status: string; data: Activity }>(`/trips/${tripId}/stops/${stopId}/activities`, data),

  updateActivity: (tripId: string, stopId: string, activityId: string, data: Partial<Activity>) =>
    api.patch<{ status: string; data: Activity }>(`/trips/${tripId}/stops/${stopId}/activities/${activityId}`, data),

  deleteActivity: (tripId: string, stopId: string, activityId: string) =>
    api.delete(`/trips/${tripId}/stops/${stopId}/activities/${activityId}`),

  reorderActivities: (tripId: string, stopId: string, activities: { id: string; order: number }[]) =>
    api.patch(`/trips/${tripId}/stops/${stopId}/activities/reorder`, { activities }),
};
