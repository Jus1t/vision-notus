import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      else {
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }
    }
    verifyToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/login/', { Email: email, Password: password });
      console.log(response)
      const { accessToken} = response.data;
      localStorage.setItem('token', accessToken);
      if (accessToken) setIsAuthenticated(true);
      return accessToken
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};