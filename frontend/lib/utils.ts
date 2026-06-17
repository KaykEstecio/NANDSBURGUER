/**
 * Utility functions
 */

type ClassValue = string | false | null | undefined;

export const cn = (...classes: ClassValue[]): string => {
  return classes.filter(Boolean).join(' ');
};

// String utilities
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

// Number utilities
export const formatCurrency = (value: number, currency: string = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(value);
};

export const formatPrice = (price: number): string => {
  return `R$ ${price.toFixed(2)}`;
};

// Date utilities
export const formatDate = (date: Date | string, locale: string = 'pt-BR'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale);
};

export const formatDateTime = (
  date: Date | string,
  locale: string = 'pt-BR'
): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString(locale);
};

// Array utilities
export const groupBy = <T,>(
  array: T[],
  key: keyof T
): Record<string, T[]> => {
  return array.reduce(
    (result, item) => {
      const group = String(item[key]);
      if (!result[group]) result[group] = [];
      result[group].push(item);
      return result;
    },
    {} as Record<string, T[]>
  );
};

export const unique = <T,>(array: T[], key?: keyof T): T[] => {
  if (!key) return Array.from(new Set(array));
  return array.filter((item, index, self) =>
    index === self.findIndex((t) => t[key] === item[key])
  );
};

// Object utilities
export const omit = <T extends Record<string, any>,>(
  obj: T,
  ...keys: (keyof T)[]
): Partial<T> => {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
};

export const pick = <T extends Record<string, any>,>(
  obj: T,
  ...keys: (keyof T)[]
): Partial<T> => {
  return keys.reduce(
    (result, key) => {
      result[key] = obj[key];
      return result;
    },
    {} as Partial<T>
  );
};

// Validation utilities
export const isEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

// Async utilities
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const retry = async <T,>(
  fn: () => Promise<T>,
  options: { maxAttempts?: number; delayMs?: number } = {}
): Promise<T> => {
  const { maxAttempts = 3, delayMs = 1000 } = options;
  let lastError: Error | null = null;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxAttempts - 1) {
        await delay(delayMs);
      }
    }
  }

  throw lastError;
};
