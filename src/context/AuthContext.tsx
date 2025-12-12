import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, UserRole } from '@/types/database';
// import { users } from '@/data/mockData'; // No longer needed
import { loginUser } from '@/services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('craftcycle_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const { user: loggedInUser } = await loginUser(email, password);
      setUser(loggedInUser);
      localStorage.setItem('craftcycle_user', JSON.stringify(loggedInUser));
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('craftcycle_user');
  }, []);

  const hasRole = useCallback((roles: UserRole[]) => {
    if (!user || !user.role) return false;
    return roles.some(role => role.toLowerCase() === user.role.toLowerCase());
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      hasRole,
    }}>
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
