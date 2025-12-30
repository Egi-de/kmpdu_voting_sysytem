import { User } from '@/types/voting';
import { mockUser, mockAdminUser, mockSuperuseradminUser } from '@/data/mockData';

export interface LoginRequest {
  memberId: string;
  nationalId: string;
}

export interface OTPRequest {
  memberId: string;
  otp: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Mock database
const users = [mockUser, mockAdminUser, mockSuperuseradminUser];

export const authService = {
  login: async (data: LoginRequest) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (!data.memberId) {
       throw { response: { data: { message: "Member ID is required" } } };
    }
    
    return { success: true, message: "OTP sent" };
  },

  verifyOtp: async (data: OTPRequest) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let user = users.find(u => u.memberId === data.memberId) || mockUser;
    
    if (data.memberId.toLowerCase().includes('adm')) {
        user = mockAdminUser;
    } else if (data.memberId.toLowerCase().includes('sup')) {
        user = mockSuperuseradminUser;
    }

    return {
      token: "mock_jwt_token_" + Math.random().toString(36).substring(7),
      user: user
    };
  },

  getProfile: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockUser; 
  },

  logout: () => {
    localStorage.removeItem('auth_token');
  },
};
