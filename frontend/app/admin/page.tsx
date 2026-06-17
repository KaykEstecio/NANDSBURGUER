'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import { apiClient } from '../../services/api';
import { Category, Order, Product } from '../../types';
import {
  formatCurrency,
  formatDateTime,
  getDisplayOrderNumber,
  getInvoiceNumber
} from '../../lib/invoice';

export default function AdminPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { products, categories, fetchProducts, fetchCategories } = useProducts();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: ''
  });

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
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? updatedOrder : order))
      );
      setMessage(`Pedido atualizado.`);
    } catch (error) {
      setMessage('Erro ao atualizar pedido.');
      console.error(error);
    }
  }

  async function handleCreateProduct(event: React.FormEvent) {
    event.preventDefault();
    setMessage('');

    try {
      await apiClient.createProduct({
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        categoryId: formData.categoryId
      });

      setMessage('Produto criado com sucesso.');
      setFormData({ name: '', description: '', price: '', stock: '', categoryId: '' });
      fetchProducts(0, 100);
    } catch (error) {
      setMessage('Erro ao criar produto.');
      console.error(error);
    }
  }

  async function handleDeleteProduct(productId: string) {
    setMessage('');
    try {
      await apiClient.deleteProduct(productId);
      setMessage('Produto removido.');
      fetchProducts(0, 100);
    } catch (error) {
      setMessage('Erro ao remover produto.');
      console.error(error);
    }
  }

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === 'PENDING'),
    [orders]
  );

  const paidOrders = useMemo(
    () => orders.filter((order) => order.status === 'PAID'),
    [orders]
  );

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
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Gestao do restaurante</p>
            <h1 className="mt-3 text-4xl font-bold">Painel do dono</h1>
            <p className="mt-3 max-w-2xl text-gray-600">
              Priorize pedidos pendentes, acompanhe faturamento, emita notas dos pedidos e controle o estoque.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="rounded-full bg-[#D62828] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#b11f1f]"
          >
            Gerenciar todos os pedidos
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Pedidos pendentes" value={String(pendingOrders.length)} detail="precisam de preparo" />
        <MetricCard label="Receita valida" value={formatCurrency(revenue)} detail="sem cancelados/falhas" />
        <MetricCard label="Ticket medio" value={formatCurrency(averageTicket)} detail={`${paidOrders.length} pedidos pagos`} />
        <MetricCard label="Estoque baixo" value={String(lowStockProducts.length)} detail="itens com 10 ou menos" />
      </section>

      {message && (
        <div className="rounded-3xl bg-[#F77F00]/15 p-4 text-sm font-semibold text-[#111]">
          {message}
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8">
          <section className="rounded-[2rem] bg-[#000] p-8 text-white shadow-xl shadow-black/10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#F77F00]">Fila da cozinha</p>
                <h2 className="mt-3 text-2xl font-bold">Pedidos que precisam de acao</h2>
              </div>
              <button
                onClick={fetchOrders}
                className="rounded-full bg-[#F77F00] px-4 py-2 text-sm font-semibold text-[#000]"
              >
                Atualizar
              </button>
            </div>

            {isLoading ? (
              <p className="mt-6 text-gray-300">Carregando pedidos...</p>
            ) : pendingOrders.length === 0 ? (
              <p className="mt-6 text-gray-300">Nenhum pedido pendente agora.</p>
            ) : (
              <div className="mt-6 space-y-4">
                {pendingOrders.slice(0, 6).map((order) => (
                  <div key={order.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="font-semibold">Pedido #{getDisplayOrderNumber(order)}</p>
                        <p className="mt-1 text-sm text-gray-300">
                          {formatDateTime(order.createdAt)} - {order.items?.length || 0} item(ns)
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                          Nota: {getInvoiceNumber(order)}
                        </p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-xl font-bold text-[#F77F00]">{formatCurrency(order.total)}</p>
                        <div className="mt-3 flex flex-wrap gap-2 md:justify-end">
                          <button
                            onClick={() => updateOrderStatus(order.id, 'PAID')}
                            className="rounded-full bg-[#F77F00] px-4 py-2 text-xs font-semibold text-[#000]"
                          >
                            Marcar pago/pronto
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                            className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
            <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Mais vendidos</p>
            <h2 className="mt-3 text-2xl font-bold">Itens que mais saem</h2>
            <div className="mt-6 space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between rounded-3xl border border-[#eee] p-4">
                  <div>
                    <p className="font-semibold text-[#111]">{index + 1}. {product.name}</p>
                    <p className="text-sm text-gray-500">Vendas registradas</p>
                  </div>
                  <span className="rounded-full bg-[#D62828]/10 px-3 py-1 text-sm font-bold text-[#D62828]">
                    {product.quantity}
                  </span>
                </div>
              ))}
              {!topProducts.length && <p className="text-sm text-gray-500">Sem vendas registradas ainda.</p>}
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <section className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
            <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Reposicao</p>
            <h2 className="mt-3 text-2xl font-bold">Estoque baixo</h2>
            <div className="mt-6 space-y-3">
              {lowStockProducts.slice(0, 8).map((product) => (
                <div key={product.id} className="flex items-center justify-between rounded-3xl border border-[#eee] p-4">
                  <div>
                    <p className="font-semibold text-[#111]">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category?.name || 'Sem categoria'}</p>
                  </div>
                  <span className="rounded-full bg-[#D62828]/10 px-3 py-1 text-sm font-bold text-[#D62828]">
                    {product.stock}
                  </span>
                </div>
              ))}
              {!lowStockProducts.length && <p className="text-sm text-gray-500">Estoque em nivel confortavel.</p>}
            </div>
          </section>

          <section className="rounded-[2rem] bg-[#000] p-8 text-white shadow-xl shadow-black/10">
            <p className="text-sm uppercase tracking-[0.35em] text-[#F77F00]">Cardapio</p>
            <h2 className="mt-3 text-2xl font-bold">Criar novo item</h2>
            <form onSubmit={handleCreateProduct} className="mt-6 space-y-4">
              <input
                required
                type="text"
                placeholder="Nome do produto"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                className="w-full rounded-3xl border border-[#333] bg-[#111] px-5 py-4 text-white"
              />
              <textarea
                placeholder="Descricao"
                value={formData.description}
                onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                className="w-full rounded-3xl border border-[#333] bg-[#111] px-5 py-4 text-white"
                rows={3}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Preco"
                  value={formData.price}
                  onChange={(event) => setFormData({ ...formData, price: event.target.value })}
                  className="w-full rounded-3xl border border-[#333] bg-[#111] px-5 py-4 text-white"
                />
                <input
                  required
                  type="number"
                  min="0"
                  placeholder="Estoque"
                  value={formData.stock}
                  onChange={(event) => setFormData({ ...formData, stock: event.target.value })}
                  className="w-full rounded-3xl border border-[#333] bg-[#111] px-5 py-4 text-white"
                />
              </div>
              <select
                required
                value={formData.categoryId}
                onChange={(event) => setFormData({ ...formData, categoryId: event.target.value })}
                className="w-full rounded-3xl border border-[#333] bg-[#111] px-5 py-4 text-white"
              >
                <option value="" disabled>
                  Selecionar categoria
                </option>
                {categories.map((category: Category) => (
                  <option key={category.id} value={category.id} className="text-black">
                    {category.name}
                  </option>
                ))}
              </select>
              <button className="w-full rounded-full bg-[#D62828] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#b11f1f]">
                Criar produto
              </button>
            </form>
          </section>

          <section className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
            <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Produtos</p>
            <h2 className="mt-3 text-2xl font-bold">Edicao rapida</h2>
            <div className="mt-6 max-h-[520px] space-y-3 overflow-y-auto pr-1">
              {products.map((product: Product) => (
                <div key={product.id} className="flex items-center justify-between gap-3 rounded-3xl border border-[#eee] p-4">
                  <div>
                    <p className="font-semibold text-[#111]">{product.name}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(product.price)} - Estoque: {product.stock}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="rounded-full bg-[#F77F00] px-4 py-2 text-xs font-semibold text-[#000]"
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-[2rem] border border-[#f1e4db] bg-white p-6 shadow-sm">
      <p className="text-sm uppercase tracking-[0.25em] text-[#D62828]">{label}</p>
      <p className="mt-4 text-3xl font-bold">{value}</p>
      <p className="mt-2 text-sm text-gray-500">{detail}</p>
    </div>
  );
}
