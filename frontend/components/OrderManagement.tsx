'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiClient } from '../services/api';
import { Order, OrderItem } from '../types';
import {
  formatCurrency,
  formatDateTime,
  getDisplayOrderNumber,
  getInvoiceAccessKey,
  getInvoiceNumber,
} from '../lib/invoice';
import { Button } from './ui/button';
import { Input, inputClassName } from './ui/input';
import { LoadingPanel, StatePanel } from './ui/state-panel';
import { OrderStatusBadge } from './ui/order-status';

interface OrderWithUser extends Order {
  user?: {
    id: string;
    name: string;
    email: string;
  };
  items?: OrderItem[];
}

type OrderStatusFilter = 'ALL' | Order['status'];

const statusOptions: Array<{ value: OrderStatusFilter; label: string }> = [
  { value: 'ALL', label: 'Todos' },
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'PAID', label: 'Pagos' },
  { value: 'FAILED', label: 'Falhas' },
  { value: 'CANCELLED', label: 'Cancelados' },
];

export function OrderManagement() {
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderWithUser | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setIsLoading(true);
      setError('');
      const data = await apiClient.getAllOrders(0, 50);
      setOrders(data);
      setSelectedOrder((current) => current ?? data[0] ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos');
    } finally {
      setIsLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: Order['status']) {
    try {
      setUpdatingStatus(orderId);
      setError('');
      const updatedOrder = await apiClient.updateOrderStatus(orderId, newStatus);
      setOrders((current) => current.map((order) => (order.id === orderId ? updatedOrder : order)));
      setSelectedOrder((current) => (current?.id === orderId ? updatedOrder : current));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
    } finally {
      setUpdatingStatus(null);
    }
  }

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
      const matchesQuery =
        !query ||
        order.id.toLowerCase().includes(query) ||
        getDisplayOrderNumber(order).includes(query) ||
        order.user?.name.toLowerCase().includes(query) ||
        order.user?.email.toLowerCase().includes(query);

      return matchesStatus && matchesQuery;
    });
  }, [orders, searchQuery, statusFilter]);

  if (isLoading) {
    return <LoadingPanel label="Carregando pedidos da operacao..." />;
  }

  return (
    <div className="admin-shell page-shell">
      <section className="surface-panel rounded-[1.25rem] p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black text-primary">Operacao</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Gerenciar pedidos</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Consulte clientes, revise itens e atualize o andamento de cada pedido.
            </p>
          </div>
          <Button variant="outline" onClick={loadOrders}>
            Atualizar lista
          </Button>
        </div>
      </section>

      {error ? (
        <div className="rounded-xl border border-primary/25 bg-primary/[0.06] px-4 py-3 text-sm font-semibold text-primary">
          {error}
        </div>
      ) : null}

      <section className="surface-panel rounded-[1.25rem] p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
          <label className="space-y-2 text-sm font-bold">
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as OrderStatusFilter)}
              className={inputClassName}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-bold">
            <span>Buscar pedido</span>
            <Input
              type="search"
              placeholder="Numero, cliente ou email"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>
        </div>
      </section>

      {filteredOrders.length === 0 ? (
        <StatePanel
          title="Nenhum pedido encontrado"
          description="Ajuste os filtros ou atualize a lista para tentar novamente."
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <button
                type="button"
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`surface-panel w-full rounded-xl p-4 text-left transition sm:p-5 ${
                  selectedOrder?.id === order.id
                    ? 'border-primary/40 ring-2 ring-primary/10'
                    : 'hover:border-primary/20 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black">Pedido #{getDisplayOrderNumber(order)}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="mt-2 truncate text-sm font-semibold">
                      {order.user?.name || 'Cliente'}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{order.user?.email}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-end justify-between gap-5 sm:flex-col sm:text-right">
                    <span className="text-xs font-bold text-muted-foreground">
                      {order.items?.length || 0} item(ns)
                    </span>
                    <span className="text-xl font-black text-primary">
                      {formatCurrency(Number(order.total))}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {selectedOrder ? (
            <aside className="surface-panel rounded-[1.25rem] p-5 xl:sticky xl:top-24">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black text-muted-foreground">PEDIDO</p>
                  <h2 className="mt-1 text-2xl font-black">
                    #{getDisplayOrderNumber(selectedOrder)}
                  </h2>
                </div>
                <OrderStatusBadge status={selectedOrder.status} />
              </div>

              <div className="mt-5 space-y-4 border-y border-border py-5 text-sm">
                <div>
                  <p className="text-xs font-bold text-muted-foreground">Cliente</p>
                  <p className="mt-1 font-bold">{selectedOrder.user?.name || 'Cliente'}</p>
                  <p className="text-muted-foreground">{selectedOrder.user?.email}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground">Total</p>
                  <p className="mt-1 text-2xl font-black text-primary">
                    {formatCurrency(Number(selectedOrder.total))}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground">Data</p>
                  <p className="mt-1 font-semibold">{formatDateTime(selectedOrder.createdAt)}</p>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-black text-muted-foreground">ITENS</p>
                <div className="mt-3 max-h-52 space-y-2 overflow-y-auto pr-1">
                  {selectedOrder.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-lg bg-muted/60 p-3 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-bold">{item.product?.name}</p>
                        <p className="text-xs text-muted-foreground">Quantidade: {item.quantity}</p>
                      </div>
                      <p className="shrink-0 font-black">{formatCurrency(Number(item.price))}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="print-invoice mt-5 rounded-xl bg-muted/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">Nota simplificada</p>
                    <p className="mt-1 text-sm font-black">{getInvoiceNumber(selectedOrder)}</p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => window.print()}
                    className="print-hide"
                  >
                    Imprimir
                  </Button>
                </div>
                <p className="mt-3 break-all font-mono text-[10px] text-muted-foreground">
                  {getInvoiceAccessKey(selectedOrder)}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                {(['PENDING', 'PAID', 'FAILED', 'CANCELLED'] as Order['status'][]).map((status) => (
                  <Button
                    key={status}
                    variant={selectedOrder.status === status ? 'secondary' : 'outline'}
                    size="sm"
                    disabled={
                      updatingStatus === selectedOrder.id || selectedOrder.status === status
                    }
                    onClick={() => updateOrderStatus(selectedOrder.id, status)}
                  >
                    {statusOptions.find((option) => option.value === status)?.label}
                  </Button>
                ))}
              </div>
            </aside>
          ) : null}
        </div>
      )}
    </div>
  );
}
