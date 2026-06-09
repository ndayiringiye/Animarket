import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface Hotel {
  _id: string;
  hotelName: string;
  email: string;
  phone: string;
  registrationNumber: string;
  hotelType: string;
  country: string;
  city: string;
  address: string;
  logo?: string;
  coverImage?: string;
  profileImage?: string;
  status: string;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface HotelAuthContextType {
  hotel: Hotel | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  register: (formData: FormData) => Promise<any>;
  login: (email: string, password: string) => Promise<Hotel>;
  logout: () => void;
  refreshHotel: () => Promise<void>;
}

const HotelAuthContext = createContext<HotelAuthContextType | undefined>(undefined);

export const HotelAuthProvider = ({ children }: { children: ReactNode }) => {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('hotelToken'));
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:4000/api/hotels';

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    const loadHotel = async () => {
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          setHotel({
            _id: decoded.id || decoded._id,
            hotelName: "",
            email: "",
            phone: "",
            registrationNumber: "",
            hotelType: "",
            country: "",
            city: "",
            address: "",
            status: "pending",
            isVerified: false,
          });
        } catch (error) {
          console.error("Invalid token");
          localStorage.removeItem('hotelToken');
          setToken(null);
          setHotel(null);
        }
      }
      setLoading(false);
    };
    loadHotel();
  }, [token]);

  const register = async (formData: FormData) => {
    const response = await axios.post(`${API_BASE}/register`, formData);
    return response.data;
  };

  const login = async (email: string, password: string): Promise<Hotel> => {
    const response = await axios.post(`${API_BASE}/login`, { email, password });
    const { token: newToken, data: hotelData } = response.data;

    localStorage.setItem('hotelToken', newToken);
    setToken(newToken);
    setHotel(hotelData);
    return hotelData;
  };

  const logout = () => {
    localStorage.removeItem('hotelToken');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setHotel(null);
  };

  const refreshHotel = async () => {
    if (!token || !hotel) return;
    try {
      const response = await axios.get(`${API_BASE}/${hotel._id}/profile`);
      setHotel(response.data.data);
    } catch (error) {
      console.error("Failed to refresh hotel", error);
    }
  };

  const value = {
    hotel,
    token,
    loading,
    isAuthenticated: !!token && !!hotel,
    register,
    login,
    logout,
    refreshHotel,
  };

  return <HotelAuthContext.Provider value={value}>{children}</HotelAuthContext.Provider>;
};

export const useHotelAuth = () => {
  const context = useContext(HotelAuthContext);
  if (context === undefined) {
    throw new Error('useHotelAuth must be used within a HotelAuthProvider');
  }
  return context;
};
