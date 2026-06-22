// App configuration
export const APP_NAME = 'NANDS Burguer';
export const APP_DESCRIPTION = 'Hamburgueria online com delivery';

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_SKIP = 0;

// Auth
export const JWT_TOKEN_KEY = 'token';
export const AUTH_STORAGE_KEY = 'auth';

// Roles
export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
} as const;

// Timeouts
export const REQUEST_TIMEOUT = 30000; // 30s
export const REDIRECT_TIMEOUT = 2000; // 2s
