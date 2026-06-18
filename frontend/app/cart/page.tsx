'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { formatCurrency } from '../../lib/utils';
import { LoadingPanel, StatePanel } from '../../components/ui/state-panel';

export default function CartPage() {
  const {
    items,
    total,
    fetchCart,
    updateItem,
    removeItem,
    isLoading,
    error,
    successMessage
  } = useCart();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchCart();
  }, [isAuthLoading, isAuthenticated, fetchCart, router]);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      await removeItem(productId);
    } else {
      await updateItem(productId, newQuantity);
    }
  };

  if (isAuthLoading || !isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return <LoadingPanel label="Atualizando seu carrinho..." />;
  }

  return (
    <div className="page-shell pb-28 lg:pb-8">
      <section className="overflow-hidden rounded-[1.5rem] bg-[#15110f] text-white shadow-grill">
        <div className="burger-noise p-6 sm:p-8">
          <Badge variant="secondary" className="border-0">
            Pedido
          </Badge>
          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black leading-none sm:text-5xl">
                Carrinho de compras
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/[0.72] sm:text-base">
                Revise os itens antes de seguir para retirada, delivery e
                pagamento.
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-4">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-white/[0.62]">
                Total atual
              </p>
              <p className="mt-1 text-3xl font-black text-secondary">
                {formatCurrency(total)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {(error || successMessage) && (
        <div
          role="status"
          className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
            error
              ? 'border-primary/30 bg-primary/[0.08] text-primary'
              : 'border-[#F77F00]/30 bg-[#F77F00]/15 text-[#111]'
          }`}
        >
          {error || successMessage}
        </div>
      )}

      {items.length === 0 ? (
        <StatePanel
          title="Seu carrinho esta vazio"
          description="Escolha um burger ou combo no cardapio para iniciar o pedido."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.72fr)] lg:items-start">
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <Card key={item.id} className="transition hover:border-primary/20">
                <CardContent className="p-4 sm:p-5">
                  <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex size-20 shrink-0 items-center justify-center rounded-[1rem] bg-secondary/[0.18] text-xl font-black text-primary">
                        N
                      </div>
                      <div className="min-w-0">
                        <Link href={`/products/${item.productId}`}>
                          <h2 className="truncate text-lg font-black text-foreground transition hover:text-primary">
                            {item.product?.name}
                          </h2>
                        </Link>
                        <p className="mt-1 text-sm font-semibold text-muted-foreground">
                          {formatCurrency(item.product?.price ?? 0)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
                      <div className="flex items-center rounded-full border border-border bg-background">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          className="flex size-10 items-center justify-center rounded-full text-lg font-black text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                          disabled={item.quantity <= 1}
                          aria-label="Diminuir quantidade"
                        >
                          -
                        </button>
                        <span className="min-w-10 text-center text-sm font-black">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          className="flex size-10 items-center justify-center rounded-full text-lg font-black text-foreground transition hover:bg-muted"
                          aria-label="Aumentar quantidade"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-primary">
                          {formatCurrency((item.product?.price ?? 0) * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="mt-1 text-sm font-bold text-muted-foreground transition hover:text-primary"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <Card className="overflow-hidden rounded-[1.25rem] bg-[#15110f] text-white shadow-grill">
              <CardHeader>
                <CardTitle>Resumo do pedido</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex justify-between text-sm text-white/[0.72]">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-sm text-white/[0.72]">
                  <span>Frete</span>
                  <span>Gratis</span>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex justify-between text-xl font-black text-white">
                  <span>Total</span>
                  <span className="text-secondary">{formatCurrency(total)}</span>
                </div>
                <Link
                  href="/checkout"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
                >
                  Ir para pagamento
                </Link>
                <Link
                  href="/products"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Continuar comprando
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      )}

      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 shadow-[0_-18px_40px_rgba(17,17,17,0.12)] backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Total
              </p>
              <p className="text-xl font-black text-primary">{formatCurrency(total)}</p>
            </div>
            <Link
              href="/checkout"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-5 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
            >
              Pagar
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
