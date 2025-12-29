import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/voting';
import { authService } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const apiUser = await authService.getProfile();
          // Map API user
           const userObj: any = {
            id: apiUser.id || apiUser.memberId,
            memberId: apiUser.memberId,
            name: apiUser.memberName || apiUser.name,
            email: apiUser.email || "",
            phone: apiUser.mobileNumber || apiUser.phone,
            role: apiUser.role?.toLowerCase() || "member",
            branch: apiUser.branch,
            hasVoted: apiUser.hasVoted,
            isActive: apiUser.isActive
          };
          setUser(userObj);
        } catch (error) {
          console.error("Failed to restore session", error);
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    // Token is already set in Login.tsx usually, or we can set it here if passed
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
