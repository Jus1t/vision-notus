import React, { createContext, useState, useEffect } from 'react';
import api from './api';
import axios from 'axios';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      else{
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }
    }
    verifyToken();
  }, []);

  // useEffect(() => {
  //   const verifyToken = async () => {
  //     const token = localStorage.getItem('token');
  //     if (token) {
  //       try {
  //         const response = await api.get('/verify-token');
  //         setUser(response.data.user);
  //         setIsAuthenticated(true);
  //       } catch (error) {
  //         setIsAuthenticated(false);
  //         console.error('Token verification failed:', error);
  //         localStorage.removeItem('token');
  //         localStorage.removeItem('refreshToken');
  //       }
  //     }
  //     setLoading(false);
  //   };

  //   verifyToken();
  // }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/login/', { Email:email, Password:password });
      console.log(response)
      const { accessToken, refreshToken, user } = response.data;
      localStorage.setItem('token', accessToken);
      // localStorage.setItem('refreshToken', refreshToken);
      setUser(user);
      if(accessToken)setIsAuthenticated(true);
      return accessToken
      // history.push('/admin/dashboard'); 
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};