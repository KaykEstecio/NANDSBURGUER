'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { apiClient } from '../services/api';
import { Category, Product } from '../types';

interface ProductContextType {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string;
  fetchProducts: (skip?: number, take?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchProduct: (id: string) => Promise<Product | null>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

function getMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = useCallback(async (skip = 0, take = 10) => {
    setIsLoading(true);
    setError('');

    try {
      const data = await apiClient.getProducts(skip, take);
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (requestError) {
      setError(getMessage(requestError, 'Erro ao carregar produtos.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await apiClient.getCategories();
      setCategories(data);
    } catch (requestError) {
      setError(getMessage(requestError, 'Erro ao carregar categorias.'));
    }
  }, []);

  const fetchProduct = useCallback(async (id: string) => {
    try {
      return await apiClient.getProduct(id);
    } catch (requestError) {
      setError(getMessage(requestError, 'Erro ao carregar produto.'));
      return null;
    }
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        isLoading,
        error,
        fetchProducts,
        fetchCategories,
        fetchProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
}
