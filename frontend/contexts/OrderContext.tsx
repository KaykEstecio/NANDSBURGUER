'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Order } from '../types';
import { apiClient } from '../services/api';

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  error: string;
  fetchOrders: () => Promise<void>;
  fetchOrder: (id: string) => Promise<Order | null>;
  createOrder: () => Promise<Order>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await apiClient.getOrders();
      setOrders(data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar pedidos.');
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchOrder = useCallback(async (id: string) => {
    try {
      return await apiClient.getOrder(id);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar pedido.');
      console.error('Failed to fetch order:', error);
      return null;
    }
  }, []);

  const createOrder = useCallback(async () => {
    try {
      const order = await apiClient.createOrder();
      await fetchOrders();
      return order;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }, [fetchOrders]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        isLoading,
        error,
        fetchOrders,
        fetchOrder,
        createOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
}
