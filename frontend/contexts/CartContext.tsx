'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem as CartItemType } from '../types';
import { apiClient } from '../services/api';

interface CartContextType {
  items: CartItemType[];
  total: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.getCart();
      setItems(response.items || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addItem = useCallback(
    async (productId: string, quantity: number) => {
      try {
        await apiClient.addToCart(productId, quantity);
        await fetchCart();
      } catch (error) {
        console.error('Failed to add item:', error);
        throw error;
      }
    },
    [fetchCart]
  );

  const updateItem = useCallback(
    async (productId: string, quantity: number) => {
      try {
        await apiClient.updateCartItem(productId, quantity);
        await fetchCart();
      } catch (error) {
        console.error('Failed to update item:', error);
        throw error;
      }
    },
    [fetchCart]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      try {
        await apiClient.removeFromCart(productId);
        await fetchCart();
      } catch (error) {
        console.error('Failed to remove item:', error);
        throw error;
      }
    },
    [fetchCart]
  );

  const clearCart = useCallback(async () => {
    try {
      await apiClient.clearCart();
      setItems([]);
      setTotal(0);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        isLoading,
        fetchCart,
        addItem,
        updateItem,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
