'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { Order, OrderItem, Product } from '../types';
import {
  formatCurrency,
  getDisplayOrderNumber,
  getInvoiceAccessKey,
  getInvoiceNumber
} from '../lib/invoice';

interface OrderWithUser extends Order {
  user?: {
    id: string;
    name: string;
    email: string;
  };
  items?: OrderItem[];
}

type OrderStatusFilter = 'ALL' | Order['status'];

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
  }, [statusFilter]);

  async function loadOrders() {
    try {
      setIsLoading(true);
      setError('');
      const data = await apiClient.getAllOrders(0, 50);
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos');
    } finally {
      setIsLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
      setUpdatingStatus(orderId);
      const updatedOrder = await apiClient.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updatedOrder);
      }

      const displayOrder = orders.find((order) => order.id === orderId);
      alert(`Pedido #${displayOrder ? getDisplayOrderNumber(displayOrder) : '----'} atualizado para ${newStatus}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
    } finally {
      setUpdatingStatus(null);
    }
  }

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-100 text-gray-800'
  };

  const statusBadges: Record<string, string> = {
    PENDING: '⏳ Pendente',
    PAID: '✅ Pago',
    FAILED: '❌ Falha',
    CANCELLED: '🚫 Cancelado'
  };

  const filteredOrders = orders
    .filter(order => statusFilter === 'ALL' || order.status === statusFilter)
    .filter(order => {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        getDisplayOrderNumber(order).includes(query) ||
        order.user?.name.toLowerCase().includes(query) ||
        order.user?.email.toLowerCase().includes(query)
      );
    });

  if (isLoading) {
    return <div className="flex items-center justify-center py-12">⏳ Carregando pedidos...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#111111] mb-2">📦 Gerenciar Pedidos</h1>
          <p className="text-gray-600">Acompanhe e atualize o status dos pedidos</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Filtro de Status */}
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatusFilter)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-[#D62828]"
              >
                <option value="ALL">Todos os pedidos</option>
                <option value="PENDING">⏳ Pendente</option>
                <option value="PAID">✅ Pago</option>
                <option value="FAILED">❌ Falha</option>
                <option value="CANCELLED">🚫 Cancelado</option>
              </select>
            </div>

            {/* Busca */}
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">Buscar</label>
              <input
                type="text"
                placeholder="ID do pedido, cliente ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-[#D62828]"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800 text-sm">❌ {error}</p>
          </div>
        )}

        {/* Grid de Pedidos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Pedidos */}
          <div className="lg:col-span-2">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <p className="text-gray-500 text-lg">Nenhum pedido encontrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer transition hover:shadow-md border-2 ${
                      selectedOrder?.id === order.id ? 'border-[#D62828] bg-red-50/30' : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold text-sm text-[#111111]">
                            Pedido #{getDisplayOrderNumber(order)}
                          </p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                            {statusBadges[order.status]}
                          </span>
                        </div>
                        <p className="font-semibold text-[#111111]">{order.user?.name || 'Cliente'}</p>
                        <p className="text-xs text-gray-500">{order.user?.email}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-sm text-gray-600">{order.items?.length || 0} item(ns)</p>
                          <p className="font-bold text-[#D62828]">{formatCurrency(Number(order.total))}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detalhes do Pedido Selecionado */}
          {selectedOrder && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
                <h2 className="text-2xl font-bold text-[#111111] mb-4">Detalhes do Pedido</h2>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Numero do pedido</p>
                    <p className="text-lg font-bold text-[#111111]">#{getDisplayOrderNumber(selectedOrder)}</p>
                    <p className="mt-1 font-mono text-[11px] break-all text-gray-400">
                      ID tecnico: {selectedOrder.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Cliente</p>
                    <p className="font-semibold">{selectedOrder.user?.name}</p>
                    <p className="text-xs text-gray-600">{selectedOrder.user?.email}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                    <p className="text-2xl font-bold text-[#D62828]">{formatCurrency(Number(selectedOrder.total))}</p>
                  </div>

                  <div className="print-invoice rounded-xl bg-[#f9f1e8] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Nota fiscal</p>
                        <p className="mt-1 font-semibold text-[#111]">{getInvoiceNumber(selectedOrder)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="print-hide rounded-full bg-[#F77F00] px-3 py-1 text-xs font-semibold text-[#000]"
                      >
                        Imprimir
                      </button>
                    </div>
                    <p className="mt-3 break-all font-mono text-[11px] text-gray-500">
                      Chave: {getInvoiceAccessKey(selectedOrder)}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      Total da nota: {formatCurrency(Number(selectedOrder.total))}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="border-t pt-4 mb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Itens</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedOrder.items?.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                        <div>
                          <p className="font-semibold text-[#111111]">{item.product?.name}</p>
                          <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">{formatCurrency(Number(item.price))}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Atualizar Status */}
                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Atualizar Status</p>
                  <div className="space-y-2">
                    {['PENDING', 'PAID', 'FAILED', 'CANCELLED'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder.id, status)}
                        disabled={updatingStatus === selectedOrder.id || selectedOrder.status === status}
                        className={`w-full py-2 px-3 rounded-lg text-sm font-semibold transition ${
                          selectedOrder.status === status
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-[#D62828] text-white hover:bg-[#b11f1f]'
                        }`}
                      >
                        {updatingStatus === selectedOrder.id ? '⏳' : statusBadges[status]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
