'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useOrders } from '../../contexts/OrderContext';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getDisplayOrderNumber } from '../../lib/invoice';
import { formatCurrency } from '../../lib/utils';

export default function OrdersPage() {
  const { orders, isLoading, error, fetchOrders } = useOrders();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchOrders();
  }, [isAuthLoading, isAuthenticated, fetchOrders, router]);

  if (isAuthLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] bg-[#000000] p-10 text-white shadow-xl shadow-black/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#F77F00]">Meus Pedidos</p>
            <h1 className="mt-3 text-4xl font-bold">Acompanhe seus pedidos</h1>
            <p className="mt-3 max-w-2xl text-gray-300">
              Veja o histórico de compras, valores e status de cada pedido feito na Nands Burger.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full bg-[#F77F00] px-6 py-3 text-sm font-semibold text-[#000000] transition hover:bg-[#e06f00]"
          >
            Ver Cardápio
          </Link>
        </div>
      </section>

      {isLoading ? (
        <div className="rounded-[2rem] bg-white p-12 text-center shadow-xl shadow-black/5">
          <p className="text-gray-600">Carregando pedidos...</p>
        </div>
      ) : error ? (
        <div className="rounded-[2rem] border border-[#D62828]/20 bg-white p-8 text-center shadow-xl shadow-black/5 sm:p-12">
          <p className="text-xl font-semibold text-[#111]">Nao foi possivel carregar seus pedidos</p>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
          <button
            onClick={() => fetchOrders()}
            className="mt-6 rounded-full bg-[#D62828] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#b11f1f]"
          >
            Tentar novamente
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-[2rem] bg-white p-12 text-center shadow-xl shadow-black/5">
          <p className="text-xl font-semibold text-gray-700 mb-4">Você ainda não tem pedidos</p>
          <Link
            href="/products"
            className="inline-flex rounded-full bg-[#D62828] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#b11f1f]"
          >
            Continuar Comprando
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="rounded-[2rem] border border-[#f1e4db] bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">
                    Pedido #{getDisplayOrderNumber(order)}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')} • {order.items?.length || 0} itens
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-3xl font-bold text-[#D62828]">{formatCurrency(Number(order.total))}</p>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold mt-2 ${
                      order.status === 'PAID'
                        ? 'bg-[#D62828]/15 text-[#D62828]'
                        : order.status === 'CANCELLED'
                        ? 'bg-[#000000]/10 text-[#000000]'
                        : 'bg-[#F77F00]/15 text-[#000000]'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] bg-[#f9f1e8] p-5">
                <h3 className="font-semibold text-[#111] mb-3">Itens do pedido</h3>
                <div className="space-y-3 text-sm text-[#4a4a4a]">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex justify-between gap-4">
                      <span>{item.product?.name}</span>
                      <span>{item.quantity}x {formatCurrency(Number(item.price))}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-[#eee] pt-4 text-right">
                <Link
                  href={`/orders/${order.id}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#D62828] transition hover:text-[#b11f1f]"
                >
                  Ver Detalhes →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
