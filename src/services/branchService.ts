import api from '@/lib/api';
import { Branch } from '@/types/voting';

export const branchService = {
  getBranches: async () => {
    const response = await api.get('/api/branches');
    return response.data;
  },

  createBranch: async (data: Partial<Branch>) => {
    const response = await api.post('/api/branches', data);
    return response.data;
  },

  updateBranch: async (id: string, data: Partial<Branch>) => {
    const response = await api.put(`/api/branches/${id}`, data);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/api/branches/stats');
    return response.data;
  },
};
