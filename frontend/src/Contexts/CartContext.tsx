'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: any;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  cartCount: number;
  cartTotal: number;
  liked: Record<number, boolean>;
  toggleLike: (id: number) => void;
  likeCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
  };

  const toggleLike = (id: number) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const likeCount = Object.values(liked).filter(Boolean).length;

  return (
    <CartContext.Provider value={{ cartItems, addToCart, cartCount, cartTotal, liked, toggleLike, likeCount }}>
      {children}
    </CartContext.Provider>
  );
};