'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem as CartItemType } from '../types';
import { apiClient } from '../services/api';

interface CartContextType {
  items: CartItemType[];
  total: number;
  isLoading: boolean;
  error: string;
  successMessage: string;
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
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiClient.getCart();
      const cartItems = Array.isArray(response) ? response : response.items || [];
      const cartTotal =
        typeof response.total === 'number'
          ? response.total
          : cartItems.reduce(
              (sum: number, item: CartItemType) =>
                sum + (item.product?.price || 0) * item.quantity,
              0
            );

      setItems(cartItems);
      setTotal(cartTotal);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar carrinho.');
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addItem = useCallback(
    async (productId: string, quantity: number) => {
      try {
        await apiClient.addToCart(productId, quantity);
        setSuccessMessage('Item adicionado ao carrinho.');
        await fetchCart();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erro ao adicionar item.');
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
        setSuccessMessage('Carrinho atualizado.');
        await fetchCart();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erro ao atualizar item.');
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
        setSuccessMessage('Item removido.');
        await fetchCart();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erro ao remover item.');
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
      setSuccessMessage('Carrinho limpo.');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao limpar carrinho.');
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
        error,
        successMessage,
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
