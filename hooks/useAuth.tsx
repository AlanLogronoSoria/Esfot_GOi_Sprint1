import type { User as ServiceUser } from '@/services/auth';
import * as authService from '@/services/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

type User = ServiceUser;

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (payload: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const stored = await authService.getStoredAuth();
        setToken(stored.token);
        setUser(stored.user);
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { token, user } = await authService.signInAPI(email, password);
    setToken(token);
    setUser(user);
  };

  const signUp = async (email: string, password: string) => {
    const { token, user } = await authService.signUpAPI(email, password);
    setToken(token);
    setUser(user);
  };

  const signOut = async () => {
    await authService.signOutAPI();
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (payload: Partial<User>) => {
    const updated = await authService.updateProfileAPI(payload);
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default useAuth;
