import api from '@/lib/api';

export interface VotePayload {
  positionId: string;
  candidateId: string;
  electionId: string;
}

export const votingService = {
  getBallot: async (userId: string) => {
    // This returns the positions available for the user to vote on
    const response = await api.get(`/api/votes/ballot/${userId}`);
    return response.data;
  },

  castVotes: async (userId: string, votes: VotePayload[]) => {
    const response = await api.post('/api/votes/cast', {
      userId,
      votes,
    });
    return response.data;
  },
  
  // Endpoint to get results specifically (from blockchain as per swagger)
  getResults: async (electionId: string) => {
    const response = await api.get(`/api/elections/${electionId}/results`);
    return response.data;
  }
};
