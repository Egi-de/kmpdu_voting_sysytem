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
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // In a real app, we validate credentials here
    // For mock, we just check if memberId is provided
    if (!data.memberId) {
       throw { response: { data: { message: "Member ID is required" } } };
    }
    
    return { success: true, message: "OTP sent" };
  },

  verifyOtp: async (data: OTPRequest) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple mock logic to select user based on input or default to member
    let user = users.find(u => u.memberId === data.memberId) || mockUser;
    
    // Override for specific test cases if needed, but primarily relying on input
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
    // In a real app, we'd decode the token or call /me
    // Here we might need to rely on what was stored or just return a default for persistence demo
    // Ideally, we shouldn't rely on this returning the *correct* user in a purely stateless mock
    // without some local storage persistence of the ID.
    // However, AuthContext calls this on load.
    
    // For the sake of the demo, let's try to recover based on some stored state or just default to mockUser
    // Since we don't store the user ID in local storage in this mock service separately, 
    // we will return mockUser. To support admin reload, we'd need to store the role/id in localStorage on login.
    
    return mockUser; 
  },

  logout: () => {
    localStorage.removeItem('auth_token');
  },
};
