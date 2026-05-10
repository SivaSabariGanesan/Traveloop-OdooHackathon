import api from './axios';

export interface AdminStats {
  totalUsers: number;
  totalTrips: number;
  tripsByStatus: { status: string; count: number }[];
  topCities: { city: string; visits: number }[];
  recentUsers: { id: string; firstName: string; lastName: string; email: string; role: string; createdAt: string }[];
  recentTrips: {
    id: string;
    name: string;
    destination: string | null;
    status: string;
    createdAt: string;
    user: { firstName: string; lastName: string; email: string };
  }[];
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  _count: { trips: number };
}

export const adminApi = {
  getDashboardStats: () => api.get<{ status: string; data: AdminStats }>('/admin/dashboard'),
  
  getUsers: () => api.get<{ status: string; data: AdminUser[] }>('/admin/users'),
  
  updateUserRole: (userId: string, role: 'USER' | 'ADMIN') => 
    api.patch<{ status: string; data: any }>(`/admin/users/${userId}/role`, { role }),
};
