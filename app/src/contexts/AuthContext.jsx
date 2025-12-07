import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const initAuth = async () => {
      const token = localStorage.getItem('travecations_token');
      if (token) {
        try {
          // Fetch current user from backend
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Error fetching current user:', error);
          // Token might be invalid, clear it
          localStorage.removeItem('travecations_token');
          localStorage.removeItem('travecations_user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const signup = async (email, password, name) => {
    try {
      const data = await authService.signup(email, password, name);
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (updates) => {
    try {
      // This would call a backend API to update the user profile
      // For now, just update local state
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('travecations_user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
