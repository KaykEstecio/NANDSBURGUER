export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  products?: Product[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string | null;
  isActive: boolean;
  price: number;
  stock: number;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  price: number;
  stock: number;
  categoryId: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  product?: Product;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  user?: Pick<User, 'id' | 'name' | 'email'>;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  total: number;
  items?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}
