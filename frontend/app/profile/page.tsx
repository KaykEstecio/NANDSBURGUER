'use client';

import { useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useOrders } from '../../contexts/OrderContext';
import { useRouter } from 'next/navigation';
import { getDisplayOrderNumber } from '../../lib/invoice';
import { formatCurrency } from '../../lib/utils';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { orders, fetchOrders, isLoading, error } = useOrders();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchOrders();
  }, [isAuthLoading, isAuthenticated, fetchOrders, router]);

  const orderStats = useMemo(
    () => ({
      total: orders.length,
      paid: orders.filter((order) => order.status === 'PAID').length,
      pending: orders.filter((order) => order.status === 'PENDING').length,
    }),
    [orders]
  );

  if (isAuthLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[2rem] bg-[#111111] p-10 shadow-2xl shadow-black/25 text-white">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#F77F00]">Perfil</p>
            <h1 className="mt-3 text-4xl font-bold">Bem-vindo de volta, {user?.name}</h1>
            <p className="mt-4 max-w-2xl text-gray-300">
              Seus pedidos ficam sempre à mão. Acompanhe seus combos favoritos, histórico e acesse
              ofertas exclusivas da Nands Burger.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.75rem] bg-[#000000]/70 border border-[#F77F00]/15 p-5">
                <p className="text-xs uppercase tracking-[0.35em] text-[#F77F00]">Pedidos</p>
                <p className="mt-3 text-3xl font-bold">{orderStats.total}</p>
                <p className="mt-2 text-sm text-gray-400">Pedidos realizados</p>
              </div>
              <div className="rounded-[1.75rem] bg-[#000000]/70 border border-[#F77F00]/15 p-5">
                <p className="text-xs uppercase tracking-[0.35em] text-[#F77F00]">Pagos</p>
                <p className="mt-3 text-3xl font-bold">{orderStats.paid}</p>
                <p className="mt-2 text-sm text-gray-400">Pedidos concluídos</p>
              </div>
              <div className="rounded-[1.75rem] bg-[#000000]/70 border border-[#F77F00]/15 p-5">
                <p className="text-xs uppercase tracking-[0.35em] text-[#F77F00]">Aguardando</p>
                <p className="mt-3 text-3xl font-bold">{orderStats.pending}</p>
                <p className="mt-2 text-sm text-gray-400">Pedidos em andamento</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#F77F00]/20 bg-[#000000]/80 p-8 shadow-xl shadow-black/20">
            <p className="text-sm uppercase tracking-[0.35em] text-[#F77F00]">Minhas informações</p>
            <p className="mt-5 text-2xl font-semibold">{user?.name}</p>
            <p className="mt-2 text-sm text-gray-300">{user?.email}</p>
            <p className="mt-6 rounded-3xl bg-[#F77F00]/10 px-4 py-3 text-sm font-semibold text-[#111]">
              Perfil: {user?.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-10 shadow-xl shadow-black/5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Pedidos</p>
            <h2 className="mt-3 text-2xl font-bold">Últimos pedidos</h2>
          </div>
          <button
            onClick={() => fetchOrders()}
            className="rounded-full bg-[#F77F00] px-5 py-3 text-sm font-semibold text-[#000000] transition hover:bg-[#e06f00]"
          >
            Atualizar
          </button>
        </div>

        {isLoading ? (
          <div className="mt-8 text-gray-500">Carregando pedidos...</div>
        ) : error ? (
          <div className="mt-8 rounded-3xl border border-[#D62828]/20 bg-[#D62828]/5 p-8 text-[#111]">
            <p className="font-semibold">Nao foi possivel carregar os pedidos.</p>
            <p className="mt-1 text-sm text-gray-600">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-[#eee] bg-[#faf3ed] p-8 text-gray-600">
            Você ainda não fez nenhum pedido.
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="rounded-3xl border border-[#eee] p-6 shadow-sm transition hover:-translate-y-0.5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Pedido #{getDisplayOrderNumber(order)}</p>
                    <p className="mt-1 text-lg font-semibold">
                      Total: {formatCurrency(Number(order.total))}
                    </p>
                  </div>
                  <div className="space-y-2 text-right">
                    <span className="inline-flex rounded-full bg-[#F77F00]/15 px-4 py-2 text-sm font-semibold text-[#111]">
                      {order.status}
                    </span>
                    <p className="text-sm text-gray-500">Itens: {order.items?.length ?? 0}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
