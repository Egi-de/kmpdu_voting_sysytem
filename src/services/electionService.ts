import api from '@/lib/api';

export const electionService = {
  getElections: async () => {
    const response = await api.get('/api/elections');
    return response.data;
  },

  createElection: async (data: any) => {
    const response = await api.post('/api/elections', data);
    return response.data;
  },
};
