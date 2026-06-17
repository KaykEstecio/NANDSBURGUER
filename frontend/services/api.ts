import axios, { AxiosInstance } from 'axios';
import { Category, Product } from '../types';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: apiUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.client.interceptors.request.use((config) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  private unwrap<T>(response: { data: T | { success?: boolean; data?: T; error?: string } }): T {
    const payload = response.data;

    if (
      payload &&
      typeof payload === 'object' &&
      'success' in payload &&
      'data' in payload
    ) {
      return payload.data as T;
    }

    return payload as T;
  }

  private getError(error: unknown) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as { error?: string } | undefined;
      return new Error(data?.error || error.message);
    }

    return error instanceof Error ? error : new Error('Erro inesperado');
  }

  // Auth
  async register(email: string, password: string, name: string) {
    try {
      const response = await this.client.post('/auth/register', {
        email,
        password,
        name
      });
      return this.unwrap(response);
    } catch (error) {
      throw this.getError(error);
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await this.client.post('/auth/login', {
        email,
        password
      });
      return this.unwrap(response);
    } catch (error) {
      throw this.getError(error);
    }
  }

  async getMe() {
    try {
      const response = await this.client.get('/auth/me');
      return this.unwrap(response);
    } catch (error) {
      throw this.getError(error);
    }
  }

  // Products
  async getProducts(skip = 0, take = 10) {
    const response = await this.client.get('/products', {
      params: { skip, take }
    });
    return this.unwrap(response);
  }

  async getProduct(id: string) {
    const response = await this.client.get(`/products/${id}`);
    return this.unwrap(response);
  }

  async createProduct(data: Omit<Product, 'id' | 'category' | 'createdAt' | 'updatedAt'>) {
    const response = await this.client.post('/products', data);
    return this.unwrap(response);
  }

  async updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'category' | 'createdAt' | 'updatedAt'>>) {
    const response = await this.client.put(`/products/${id}`, data);
    return this.unwrap(response);
  }

  async deleteProduct(id: string) {
    const response = await this.client.delete(`/products/${id}`);
    return this.unwrap(response);
  }

  async getProductStock(id: string) {
    const response = await this.client.get(`/products/${id}`);
    return this.unwrap<Product>(response).stock;
  }

  // Categories
  async getCategories() {
    const response = await this.client.get('/categories');
    return this.unwrap(response);
  }

  async getCategory(id: string) {
    const response = await this.client.get(`/categories/${id}`);
    return this.unwrap(response);
  }

  async createCategory(data: Pick<Category, 'name' | 'description'>) {
    const response = await this.client.post('/categories', data);
    return this.unwrap(response);
  }

  async updateCategory(id: string, data: Partial<Pick<Category, 'name' | 'description'>>) {
    const response = await this.client.put(`/categories/${id}`, data);
    return this.unwrap(response);
  }

  async deleteCategory(id: string) {
    const response = await this.client.delete(`/categories/${id}`);
    return this.unwrap(response);
  }

  // Cart
  async getCart() {
    const response = await this.client.get('/cart');
    return this.unwrap(response);
  }

  async addToCart(productId: string, quantity: number) {
    try {
      const response = await this.client.post('/cart', {
        productId,
        quantity
      });
      return this.unwrap(response);
    } catch (error) {
      throw this.getError(error);
    }
  }

  async updateCartItem(productId: string, quantity: number) {
    try {
      const response = await this.client.put(`/cart/${productId}`, {
        productId,
        quantity
      });
      return this.unwrap(response);
    } catch (error) {
      throw this.getError(error);
    }
  }

  async removeFromCart(productId: string) {
    const response = await this.client.delete('/cart', {
      params: { productId }
    });
    return this.unwrap(response);
  }

  async clearCart() {
    const response = await this.client.delete('/cart');
    return this.unwrap(response);
  }

  // Orders
  async createOrder() {
    try {
      const response = await this.client.post('/orders');
      return this.unwrap(response);
    } catch (error) {
      throw this.getError(error);
    }
  }

  async getOrders() {
    const response = await this.client.get('/orders');
    return this.unwrap(response);
  }

  async getOrder(id: string) {
    const response = await this.client.get(`/orders/${id}`);
    return this.unwrap(response);
  }

  async getInvoice(orderId: string) {
    const response = await this.client.get(`/orders/${orderId}/invoice`);
    return this.unwrap(response);
  }

  async getAllOrders(skip = 0, take = 10) {
    const response = await this.client.get('/orders', {
      params: { skip, take }
    });
    return this.unwrap(response);
  }

  async updateOrderStatus(id: string, status: string) {
    const response = await this.client.put(`/orders/${id}/status`, {
      status
    });
    return this.unwrap(response);
  }
}

export const apiClient = new ApiClient();
