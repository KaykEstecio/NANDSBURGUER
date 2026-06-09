'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product, Category } from '../types';
import { apiClient } from '../services/api';

interface ProductContextType {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  fetchProducts: (skip?: number, take?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchProduct: (id: string) => Promise<Product | null>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = useCallback(async (skip = 0, take = 10) => {
    setIsLoading(true);
    try {
      const data = await apiClient.getProducts(skip, take);
      setProducts(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await apiClient.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  const fetchProduct = useCallback(async (id: string) => {
    try {
      const data = await apiClient.getProduct(id);
      return data;
    } catch (error) {
      console.error('Failed to fetch product:', error);
      return null;
    }
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        isLoading,
        fetchProducts,
        fetchCategories,
        fetchProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
}
