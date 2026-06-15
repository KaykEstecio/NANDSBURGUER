import { Order } from '../types';

type InvoiceOrderRef = {
  id: string;
  createdAt: string | Date;
};

export function getInvoiceNumber(order: InvoiceOrderRef) {
  const date = new Date(order.createdAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `NF-${year}${month}${day}-${order.id.slice(-6).toUpperCase()}`;
}

export function getInvoiceAccessKey(order: InvoiceOrderRef) {
  const compactDate = new Date(order.createdAt)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, '');
  const compactId = order.id.replace(/[^a-z0-9]/gi, '').toUpperCase();
  return `${compactDate}${compactId}`.slice(0, 44).padEnd(44, '0');
}

export function getOrderSubtotal(order: Pick<Order, 'total'> & { items?: Array<{ quantity: number; price: number }> }) {
  return (
    order.items?.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    ) || order.total
  );
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(value));
}
