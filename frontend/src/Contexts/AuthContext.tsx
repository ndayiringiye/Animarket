// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profile?: string;
  gender?: string;
  profile_img?: string;
  profile_img_public_id?: string;

  id_Number?: string;
  id_proof_img?: string;
  id_proof_img_public_id?: string;

  category?: string;
  shopName?: string;
  shopAddress?: string;
  shopLogo?: string;
  shopLogo_public_id?: string;

  role: string;
  status: string;
  isVerified: boolean;

  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
  resetOTP?: string | null;
  resetOTPExpiry?: Date | null;

  createdAt?: Date;
  updatedAt?: Date;

  profileData?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;

  register: (formData: FormData) => Promise<any>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<any>;
  verifyResetOTP: (email: string, resetOTP: string) => Promise<any>;
  confirmResetPassword: (resetToken: string, newPassword: string, confirmPassword: string) => Promise<any>;
  resetPassword: (email: string, oldPassword: string, newPassword: string, confirmPassword: string) => Promise<any>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:4000/api/users';

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          setUser({
            _id: decoded.id || decoded._id,
            name: "",
            email: "",
            role: decoded.role,
            status: "pending",
            isVerified: false,
          });
          // Then hydrate with full data from API
          try {
            const response = await axios.get(`${API_BASE}/me`);
            const fullUser = response.data.data || response.data;
            setUser(fullUser);
          } catch {
          }
        } catch (error) {
          console.error("Invalid token");
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const register = async (formData: FormData) => {
    const response = await axios.post(`${API_BASE}/register`, formData);
    return response.data;
  };

  const login = async (email: string, password: string): Promise<User> => {
    const response = await axios.post(`${API_BASE}/login`, { email, password });
    const { token: newToken, user: userData } = response.data;

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    const response = await axios.post(`${API_BASE}/forgot-password`, { email });
    return response.data;
  };

  const verifyResetOTP = async (email: string, resetOTP: string) => {
    const response = await axios.post(`${API_BASE}/verify-reset-otp`, { email, resetOTP });
    return response.data;
  };

  const confirmResetPassword = async (resetToken: string, newPassword: string, confirmPassword: string) => {
    const response = await axios.post(`${API_BASE}/confirm-reset-password`, {
      resetToken, newPassword, confirmPassword,
    });
    return response.data;
  };

  const resetPassword = async (email: string, oldPassword: string, newPassword: string, confirmPassword: string) => {
    const response = await axios.post(`${API_BASE}/reset-password`, {
      email, oldPassword, newPassword, confirmPassword,
    });
    return response.data;
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_BASE}/me`);
      setUser(response.data.data || response.data);
    } catch (error) {
      console.error("Failed to refresh user", error);
    }
  };

  const value = {
    user, token, loading, isAuthenticated: !!token && !!user,
    register, login, logout,
    forgotPassword, verifyResetOTP, confirmResetPassword, resetPassword, refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};