'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useOrders } from '../../contexts/OrderContext';
import { useAuth } from '../../contexts/AuthContext';
import { getDisplayOrderNumber } from '../../lib/invoice';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { LoadingPanel, StatePanel } from '../../components/ui/state-panel';
import { OrderStatusBadge } from '../../components/ui/order-status';

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden="true">
      <path d="M5 8h14l-1 12H6L5 8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

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
    <div className="page-shell">
      <section className="overflow-hidden rounded-[1.5rem] bg-[#15110f] text-white shadow-grill">
        <div className="burger-noise flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-black leading-none sm:text-5xl">Seus pedidos</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
              Acompanhe valores, itens e andamento de cada compra feita na Nands Burguer.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex h-11 items-center justify-center rounded-full bg-secondary px-5 text-sm font-black text-secondary-foreground transition hover:bg-secondary/90"
          >
            Voltar ao cardapio
          </Link>
        </div>
      </section>

      {isLoading ? (
        <LoadingPanel label="Buscando seus pedidos..." />
      ) : error ? (
        <StatePanel
          title="Nao foi possivel carregar os pedidos"
          description={error}
          tone="error"
          actionLabel="Tentar novamente"
          onAction={fetchOrders}
        />
      ) : orders.length === 0 ? (
        <StatePanel
          title="Seu historico ainda esta vazio"
          description="Escolha seu primeiro burger ou combo e acompanhe tudo por aqui."
          icon={<BagIcon />}
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden transition hover:border-primary/20 hover:shadow-lg">
              <CardContent className="p-0">
                <div className="flex flex-col gap-4 border-b border-border/70 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-black">Pedido #{getDisplayOrderNumber(order)}</h2>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')} · {order.items?.length || 0} item(ns)
                    </p>
                  </div>
                  <p className="text-2xl font-black text-primary">{formatCurrency(Number(order.total))}</p>
                </div>

                <div className="space-y-3 p-5">
                  {order.items?.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
                      <span className="min-w-0 truncate font-semibold text-foreground">
                        {item.quantity}x {item.product?.name}
                      </span>
                      <span className="shrink-0 text-muted-foreground">
                        {formatCurrency(Number(item.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                  {(order.items?.length || 0) > 3 ? (
                    <p className="text-xs font-bold text-muted-foreground">
                      + {(order.items?.length || 0) - 3} item(ns)
                    </p>
                  ) : null}
                </div>

                <div className="flex justify-end border-t border-border/70 p-4">
                  <Button
                    variant="ghost"
                    onClick={() => router.push(`/orders/${order.id}`)}
                    className="text-primary"
                  >
                    Ver detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
