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

  // Auth
  async register(email: string, password: string, name: string) {
    const response = await this.client.post('/auth/register', {
      email,
      password,
      name
    });
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', {
      email,
      password
    });
    return response.data;
  }

  async getMe() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // Products
  async getProducts(skip = 0, take = 10) {
    const response = await this.client.get('/products', {
      params: { skip, take }
    });
    return response.data;
  }

  async getProduct(id: string) {
    const response = await this.client.get(`/products/${id}`);
    return response.data;
  }

  async createProduct(data: Omit<Product, 'id' | 'category' | 'createdAt' | 'updatedAt'>) {
    const response = await this.client.post('/products', data);
    return response.data;
  }

  async updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'category' | 'createdAt' | 'updatedAt'>>) {
    const response = await this.client.put(`/products/${id}`, data);
    return response.data;
  }

  async deleteProduct(id: string) {
    const response = await this.client.delete(`/products/${id}`);
    return response.data;
  }

  async getProductStock(id: string) {
    const response = await this.client.get(`/products/${id}`);
    return response.data.stock;
  }

  // Categories
  async getCategories() {
    const response = await this.client.get('/categories');
    return response.data;
  }

  async getCategory(id: string) {
    const response = await this.client.get(`/categories/${id}`);
    return response.data;
  }

  async createCategory(data: Pick<Category, 'name' | 'description'>) {
    const response = await this.client.post('/categories', data);
    return response.data;
  }

  async updateCategory(id: string, data: Partial<Pick<Category, 'name' | 'description'>>) {
    const response = await this.client.put(`/categories/${id}`, data);
    return response.data;
  }

  async deleteCategory(id: string) {
    const response = await this.client.delete(`/categories/${id}`);
    return response.data;
  }

  // Cart
  async getCart() {
    const response = await this.client.get('/cart');
    return response.data;
  }

  async addToCart(productId: string, quantity: number) {
    const response = await this.client.post('/cart', {
      productId,
      quantity
    });
    return response.data;
  }

  async updateCartItem(productId: string, quantity: number) {
    const response = await this.client.put(`/cart/${productId}`, {
      productId,
      quantity
    });
    return response.data;
  }

  async removeFromCart(productId: string) {
    const response = await this.client.delete('/cart', {
      params: { productId }
    });
    return response.data;
  }

  async clearCart() {
    const response = await this.client.delete('/cart');
    return response.data;
  }

  // Orders
  async createOrder() {
    const response = await this.client.post('/orders');
    return response.data;
  }

  async getOrders() {
    const response = await this.client.get('/orders');
    return response.data;
  }

  async getOrder(id: string) {
    const response = await this.client.get(`/orders/${id}`);
    return response.data;
  }

  async getInvoice(orderId: string) {
    const response = await this.client.get(`/orders/${orderId}/invoice`);
    return response.data;
  }

  async getAllOrders(skip = 0, take = 10) {
    const response = await this.client.get('/orders', {
      params: { skip, take }
    });
    return response.data;
  }

  async updateOrderStatus(id: string, status: string) {
    const response = await this.client.put(`/orders/${id}/status`, {
      status
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();
