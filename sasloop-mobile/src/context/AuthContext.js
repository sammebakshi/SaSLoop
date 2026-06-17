import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('pos_token');
      if (token) {
        const profile = await authService.getProfile();
        setUser(profile.data);
        setIsAuthenticated(true);
      }
    } catch (e) {
      await AsyncStorage.removeItem('pos_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    const res = await authService.posLogin(username, password);
    await AsyncStorage.setItem('pos_token', res.data.token);
    const profile = await authService.getProfile();
    setUser(profile.data);
    setIsAuthenticated(true);
    return profile.data;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('pos_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
