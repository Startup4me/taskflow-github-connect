
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthState, User } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in localStorage on initial load
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData) as User;
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to parse user data', error);
        setAuthState({ ...authState, isLoading: false });
      }
    } else {
      setAuthState({ ...authState, isLoading: false });
    }
  }, []);

  // In a real app, this would be an API call
  const login = async (email: string, password: string) => {
    // Simulate API call with timeout
    try {
      // For demo purposes, we'll accept any credentials
      // In a real app, this would be validated against a backend
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
      };
      
      // Simulate JWT token
      const mockToken = `mock-jwt-token-${Date.now()}`;
      
      // Update state
      setAuthState({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
      
      // Store in localStorage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Success message
      toast.success('Successfully logged in!');
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      // For demo purposes, simulate user creation
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
      };
      
      // Simulate JWT token
      const mockToken = `mock-jwt-token-${Date.now()}`;
      
      // Update state
      setAuthState({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
      
      // Store in localStorage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Success message
      toast.success('Account created successfully!');
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
      toast.error('Signup failed. Please try again.');
    }
  };

  const logout = () => {
    // Clear state
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to home
    navigate('/');
    
    toast.success('Successfully logged out');
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
