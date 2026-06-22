'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import { apiClient } from '../../services/api';
import { Order } from '../../types';
import {
  formatCurrency,
  formatDateTime,
  getDisplayOrderNumber,
  getInvoiceNumber,
} from '../../lib/invoice';
import { Button } from '../../components/ui/button';
import { LoadingPanel, StatePanel } from '../../components/ui/state-panel';
import { OrderStatusBadge } from '../../components/ui/order-status';
import { ProductManagement } from '../../components/ProductManagement';

export default function AdminPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { products, categories, fetchProducts, fetchCategories } = useProducts();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchProducts(0, 100);
    fetchCategories();
    fetchOrders();
  }, [isAuthLoading, isAuthenticated, user, fetchProducts, fetchCategories, router]);

  async function fetchOrders() {
    setIsLoading(true);
    try {
      const data = await apiClient.getAllOrders(0, 100);
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, status: string) {
    setMessage('');
    try {
      const updatedOrder = await apiClient.updateOrderStatus(orderId, status);
      setOrders((current) => current.map((order) => (order.id === orderId ? updatedOrder : order)));
      setMessage(`Pedido atualizado.`);
    } catch (error) {
      setMessage('Erro ao atualizar pedido.');
      console.error(error);
    }
  }

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === 'PENDING'),
    [orders]
  );

  const paidOrders = useMemo(() => orders.filter((order) => order.status === 'PAID'), [orders]);

  const validOrders = useMemo(
    () => orders.filter((order) => order.status !== 'CANCELLED' && order.status !== 'FAILED'),
    [orders]
  );

  const revenue = useMemo(
    () => validOrders.reduce((sum, order) => sum + order.total, 0),
    [validOrders]
  );

  const averageTicket = validOrders.length ? revenue / validOrders.length : 0;

  const lowStockProducts = useMemo(
    () => products.filter((product) => product.stock <= 10).sort((a, b) => a.stock - b.stock),
    [products]
  );

  const topProducts = useMemo(() => {
    const sales = new Map<string, { name: string; quantity: number }>();

    orders.forEach((order) => {
      order.items?.forEach((item) => {
        const name = item.product?.name || 'Produto';
        const current = sales.get(name) || { name, quantity: 0 };
        sales.set(name, { name, quantity: current.quantity + item.quantity });
      });
    });

    return Array.from(sales.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [orders]);

  if (isAuthLoading || !isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="admin-shell page-shell">
      <section className="surface-panel rounded-[1.25rem] p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black text-primary">Gestao do restaurante</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Painel administrativo</h1>
            <p className="mt-3 max-w-2xl text-gray-600">
              Priorize pedidos pendentes, acompanhe faturamento, emita notas dos pedidos e controle
              o estoque.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-center text-sm font-black text-white transition hover:bg-primary/90"
          >
            Gerenciar todos os pedidos
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Pedidos pendentes"
          value={String(pendingOrders.length)}
          detail="precisam de preparo"
        />
        <MetricCard
          label="Receita valida"
          value={formatCurrency(revenue)}
          detail="sem cancelados/falhas"
        />
        <MetricCard
          label="Ticket medio"
          value={formatCurrency(averageTicket)}
          detail={`${paidOrders.length} pedidos pagos`}
        />
        <MetricCard
          label="Estoque baixo"
          value={String(lowStockProducts.length)}
          detail="itens com 10 ou menos"
        />
      </section>

      {message && (
        <div
          role="status"
          className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
            message.startsWith('Erro')
              ? 'border-primary/25 bg-primary/[0.07] text-primary'
              : 'border-secondary/35 bg-secondary/15 text-foreground'
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8">
          <section className="overflow-hidden rounded-[1.25rem] bg-[#15110f] p-5 text-white shadow-grill sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-secondary">Fila da cozinha</p>
                <h2 className="mt-2 text-2xl font-black">Pedidos que precisam de acao</h2>
              </div>
              <Button onClick={fetchOrders} variant="secondary" size="sm">
                Atualizar
              </Button>
            </div>

            {isLoading ? (
              <LoadingPanel
                label="Atualizando fila..."
                className="mt-6 min-h-40 border-white/10 bg-white/[0.05] text-white shadow-none"
              />
            ) : pendingOrders.length === 0 ? (
              <StatePanel
                title="Fila em dia"
                description="Nenhum pedido pendente agora."
                className="mt-6 border-white/10 bg-white/[0.05] text-white shadow-none"
              />
            ) : (
              <div className="mt-6 space-y-4">
                {pendingOrders.slice(0, 6).map((order) => (
                  <div
                    key={order.id}
                    className="rounded-xl border border-white/10 bg-white/[0.05] p-4 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-black">Pedido #{getDisplayOrderNumber(order)}</p>
                          <OrderStatusBadge
                            status={order.status}
                            className="border-secondary/40 bg-secondary/10 text-secondary"
                          />
                        </div>
                        <p className="mt-1 text-sm text-gray-300">
                          {formatDateTime(order.createdAt)} - {order.items?.length || 0} item(ns)
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                          Nota: {getInvoiceNumber(order)}
                        </p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-xl font-bold text-[#F77F00]">
                          {formatCurrency(order.total)}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 md:justify-end">
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'PAID')}
                            variant="secondary"
                            size="sm"
                          >
                            Marcar pago/pronto
                          </Button>
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                            variant="outline"
                            size="sm"
                            className="border-white/20 bg-transparent text-white hover:bg-white/10"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="surface-panel rounded-[1.25rem] p-5 sm:p-7">
            <p className="text-sm font-black text-primary">Mais vendidos</p>
            <h2 className="mt-2 text-2xl font-black">Itens que mais saem</h2>
            <div className="mt-6 space-y-3">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between rounded-xl border border-border p-4"
                >
                  <div>
                    <p className="font-semibold text-[#111]">
                      {index + 1}. {product.name}
                    </p>
                    <p className="text-sm text-gray-500">Vendas registradas</p>
                  </div>
                  <span className="rounded-full bg-[#D62828]/10 px-3 py-1 text-sm font-bold text-[#D62828]">
                    {product.quantity}
                  </span>
                </div>
              ))}
              {!topProducts.length && (
                <p className="text-sm text-gray-500">Sem vendas registradas ainda.</p>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <section className="surface-panel rounded-[1.25rem] p-5 sm:p-7">
            <p className="text-sm font-black text-primary">Reposicao</p>
            <h2 className="mt-2 text-2xl font-black">Estoque baixo</h2>
            <div className="mt-6 space-y-3">
              {lowStockProducts.slice(0, 8).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-xl border border-border p-4"
                >
                  <div>
                    <p className="font-semibold text-[#111]">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.category?.name || 'Sem categoria'}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#D62828]/10 px-3 py-1 text-sm font-bold text-[#D62828]">
                    {product.stock}
                  </span>
                </div>
              ))}
              {!lowStockProducts.length && (
                <p className="text-sm text-gray-500">Estoque em nivel confortavel.</p>
              )}
            </div>
          </section>
        </aside>
      </div>

      <ProductManagement categories={categories} onProductsChanged={() => fetchProducts(0, 100)} />
    </div>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">{label}</p>
      <p className="mt-3 text-3xl font-black">{value}</p>
      <p className="mt-2 text-sm text-gray-500">{detail}</p>
    </div>
  );
}
