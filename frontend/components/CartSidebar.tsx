'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../lib/utils';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" data-icon aria-hidden="true">
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CartSidebar({ open, onClose }: CartSidebarProps) {
  const { items, total, fetchCart, updateItem, removeItem, isLoading, error, successMessage } = useCart();

  useEffect(() => {
    if (open) {
      fetchCart();
    }
  }, [open, fetchCart]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      await removeItem(productId);
    } else {
      await updateItem(productId, newQuantity);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" data-scroll-lock="true">
      <button
        type="button"
        aria-label="Fechar carrinho"
        className="absolute inset-0 bg-black/[0.62] backdrop-blur-sm"
        onClick={onClose}
      />
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-md animate-enter flex-col bg-[#15110f] text-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho"
      >
        <div className="burger-noise flex items-center justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
          <div>
            <Badge variant="secondary" className="border-0">
              Carrinho
            </Badge>
            <h2 className="mt-3 text-2xl font-black">Seu pedido</h2>
          </div>
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            size="icon"
            className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
          >
            <CloseIcon />
          </Button>
        </div>

        <div className="menu-scrollbar flex-1 overflow-y-auto px-5 py-6 sm:px-6">
          {error || successMessage ? (
            <div
              className={`mb-4 rounded-xl border px-4 py-3 text-sm font-semibold ${
                error
                  ? 'border-primary/30 bg-primary/10 text-white'
                  : 'border-secondary/30 bg-secondary/10 text-white'
              }`}
            >
              {error || successMessage}
            </div>
          ) : null}
          {isLoading ? (
            <div className="grid min-h-44 place-items-center rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-6">
              <div className="flex flex-col items-center gap-3 text-white/70">
                <span className="size-8 animate-spin rounded-full border-4 border-white/15 border-t-secondary" />
                <span className="text-sm font-bold">Atualizando carrinho...</span>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-8 text-center">
              <h3 className="text-2xl font-black">Carrinho vazio</h3>
              <p className="mt-3 text-sm leading-6 text-white/[0.64]">
                Adicione burgers e combos ao pedido para finalizar no checkout.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-secondary px-5 text-sm font-black text-secondary-foreground shadow-cheddar transition hover:bg-secondary/90"
                onClick={onClose}
              >
                Ver cardapio
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-4 shadow-lg shadow-black/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-secondary/[0.18] text-xl font-black text-secondary">
                      N
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black text-white">{item.product?.name}</p>
                      <p className="mt-1 text-sm text-white/[0.58]">
                        {formatCurrency(item.product?.price ?? 0)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-2 py-1">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="flex size-8 items-center justify-center rounded-full bg-white/[0.08] text-base font-black transition hover:bg-white/[0.14]"
                        aria-label="Diminuir quantidade"
                      >
                        -
                      </button>
                      <span className="min-w-8 text-center text-sm font-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="flex size-8 items-center justify-center rounded-full bg-white/[0.08] text-base font-black transition hover:bg-white/[0.14]"
                        aria-label="Aumentar quantidade"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="rounded-full px-3 py-2 text-sm font-bold text-primary transition hover:bg-primary/[0.12] hover:text-white"
                    >
                      Remover
                    </button>
                  </div>

                  <Separator className="my-4 bg-white/10" />

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/[0.58]">Subtotal</span>
                    <span className="font-black text-white">
                      {formatCurrency((item.product?.price ?? 0) * item.quantity)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-white/10 bg-black/[0.18] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white/[0.58]">Subtotal</span>
            <span className="text-2xl font-black text-secondary">{formatCurrency(total)}</span>
          </div>
          <div className="mt-5 grid gap-3">
            <Link
              href={items.length ? '/checkout' : '/products'}
              onClick={onClose}
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
            >
              {items.length ? 'Finalizar pedido' : 'Escolher produtos'}
            </Link>
            <Link
              href="/products"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Continuar comprando
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
