import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () as Promise<void>; // Make logout return a promise
  fetchCurrentUser: () => Promise<void>; // Add fetchCurrentUser
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = async () => {
    setIsLoading(true);
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      setUser(null); // Ensure user is null on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = () => {
    authService.loginWithGoogle(); // This will redirect
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      // Optionally, redirect or perform other cleanup
    } catch (error) {
      console.error("Failed to logout:", error);
      // Handle logout error (e.g., show a notification)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
