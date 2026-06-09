'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useOrders } from '../../contexts/OrderContext';
import { useProducts } from '../../contexts/ProductContext';
import { apiClient } from '../../services/api';
import { Order, Product, Category } from '../../types';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const { products, categories, fetchProducts, fetchCategories } = useProducts();
  const { fetchOrders } = useOrders();
  const router = useRouter();

  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchProducts(0, 50);
    fetchCategories();
    fetchOrders();
    fetchAdminOrders();
  }, [isAuthenticated, user, fetchProducts, fetchCategories, fetchOrders, router]);

  async function fetchAdminOrders() {
    setIsAdminLoading(true);
    try {
      const data = await apiClient.getAllOrders(0, 50);
      setAdminOrders(data);
    } catch (error) {
      console.error('Failed to load admin orders:', error);
    } finally {
      setIsAdminLoading(false);
    }
  }

  const statusCount = useMemo(() => {
    return adminOrders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      { PENDING: 0, PAID: 0, FAILED: 0, CANCELLED: 0 }
    );
  }, [adminOrders]);

  const totalRevenue = useMemo(() => {
    return adminOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  }, [adminOrders]);

  const topProducts = useMemo(() => {
    const sales = new Map<string, { name: string; quantity: number }>();
    adminOrders.forEach((order) => {
      order.items?.forEach((item) => {
        const name = item.product?.name || 'Produto';
        const current = sales.get(name) || { name, quantity: 0 };
        sales.set(name, { name, quantity: current.quantity + item.quantity });
      });
    });
    return Array.from(sales.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [adminOrders]);

  const statusData = useMemo(
    () =>
      Object.entries(statusCount).map(([status, value]) => ({
        name: status,
        value
      })),
    [statusCount]
  );

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
      fetchProducts(0, 50);
    } catch (error) {
      setMessage('Erro ao criar produto.');
      console.error(error);
    }
  }

  async function handleDeleteProduct(productId: string) {
    try {
      await apiClient.deleteProduct(productId);
      setMessage('Produto removido.');
      fetchProducts(0, 50);
    } catch (error) {
      setMessage('Erro ao remover produto.');
      console.error(error);
    }
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="space-y-10">
      <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
        <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Administração</p>
        <h1 className="mt-3 text-4xl font-bold">Painel Nands Burger</h1>
        <p className="mt-3 text-gray-600 max-w-2xl">
          Visualize vendas, gerencie produtos e acompanhe pedidos em um único painel.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[2rem] border border-[#f1e4db] bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Pedidos totais</p>
              <p className="mt-4 text-4xl font-bold">{adminOrders.length}</p>
            </div>
            <div className="rounded-[2rem] border border-[#f1e4db] bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Faturamento</p>
              <p className="mt-4 text-4xl font-bold">R$ {totalRevenue.toFixed(2)}</p>
            </div>
            <div className="rounded-[2rem] border border-[#f1e4db] bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Produtos</p>
              <p className="mt-4 text-4xl font-bold">{products.length}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.95fr]">
            <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Gráfico de status</p>
                  <h2 className="mt-3 text-2xl font-bold">Status dos pedidos</h2>
                </div>
                <p className="text-sm text-gray-600">Atualizado em tempo real</p>
              </div>
              <div className="mt-8 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={35} paddingAngle={4}>
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.name === 'PAID' ? '#D62828' : entry.name === 'PENDING' ? '#F77F00' : entry.name === 'FAILED' ? '#333333' : '#000000'}
                        />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
              <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Top vendas</p>
              <h2 className="mt-3 text-2xl font-bold">Hambúrgueres mais vendidos</h2>
              <div className="mt-8 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} layout="vertical" margin={{ left: 0, right: 10, top: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" stroke="#888888" />
                    <YAxis dataKey="name" type="category" width={120} stroke="#888888" />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="#D62828" radius={[10, 10, 10, 10]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Pedidos recentes</p>
                <h2 className="mt-3 text-2xl font-bold">Últimos pedidos</h2>
              </div>
              <button
                onClick={fetchAdminOrders}
                className="rounded-full bg-[#F77F00] px-5 py-3 text-sm font-semibold text-[#000000] transition hover:bg-[#e06f00]"
              >
                Atualizar
              </button>
            </div>

            {isAdminLoading ? (
              <p className="mt-6 text-gray-500">Carregando pedidos...</p>
            ) : (
              <div className="mt-6 space-y-4">
                {(adminOrders.length ? adminOrders.slice(0, 4) : []).map((order) => (
                  <div key={order.id} className="rounded-3xl border border-[#eee] p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Pedido #{order.id}</p>
                        <p className="text-lg font-semibold">Total: R$ {order.total.toFixed(2)}</p>
                      </div>
                      <span className="rounded-full bg-[#F77F00]/15 px-3 py-1 text-sm font-semibold text-[#111]">{order.status}</span>
                    </div>
                  </div>
                ))}
                {!adminOrders.length && <p className="text-gray-500">Nenhum pedido encontrado.</p>}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] bg-[#000000] p-8 text-white shadow-xl shadow-black/10">
            <p className="text-sm uppercase tracking-[0.35em] text-[#F77F00]">Gerenciar produto</p>
            <h2 className="mt-3 text-2xl font-bold">Criar novo item</h2>
            <form onSubmit={handleCreateProduct} className="mt-6 space-y-4">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Nome do produto"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  className="w-full rounded-3xl border border-[#333] bg-[#111] px-5 py-4 text-white"
                />
                <textarea
                  placeholder="Descrição"
                  value={formData.description}
                  onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                  className="w-full rounded-3xl border border-[#333] bg-[#111] px-5 py-4 text-white"
                  rows={4}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="number"
                  placeholder="Preço"
                  value={formData.price}
                  onChange={(event) => setFormData({ ...formData, price: event.target.value })}
                  className="w-full rounded-3xl border border-[#333] bg-[#111] px-5 py-4 text-white"
                />
                <input
                  type="number"
                  placeholder="Estoque"
                  value={formData.stock}
                  onChange={(event) => setFormData({ ...formData, stock: event.target.value })}
                  className="w-full rounded-3xl border border-[#333] bg-[#111] px-5 py-4 text-white"
                />
              </div>
              <select
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
            {message && <p className="mt-4 text-sm text-[#F77F00]">{message}</p>}
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Catálogo</p>
                <h2 className="mt-3 text-2xl font-bold">Produtos</h2>
              </div>
              <p className="text-sm text-gray-600">Gerencie entradas rapidamente</p>
            </div>
            <div className="mt-6 space-y-4">
              {products.map((product: Product) => (
                <div key={product.id} className="flex flex-col gap-3 rounded-3xl border border-[#eee] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-[#111]">{product.name}</p>
                    <p className="text-sm text-gray-500">R$ {product.price.toFixed(2)} • Estoque: {product.stock}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="rounded-full bg-[#F77F00] px-4 py-3 text-sm font-semibold text-[#000000] transition hover:bg-[#e06f00]"
                  >
                    Excluir
                  </button>
                </div>
              ))}
              {!products.length && <p className="text-gray-500">Nenhum produto cadastrado.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
