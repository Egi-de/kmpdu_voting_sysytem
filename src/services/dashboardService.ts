import api from '@/lib/api';

export const dashboardService = {
  getMemberDashboard: async (userId: string) => {
    const response = await api.get(`/api/dashboard/member/${userId}`);
    return response.data;
  },

  getAdminDashboard: async () => {
    const response = await api.get('/api/dashboard/admin');
    return response.data;
  },

  getSuperAdminDashboard: async () => {
    const response = await api.get('/api/dashboard/superadmin');
    return response.data;
  },
};
