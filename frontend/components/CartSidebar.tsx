'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useCart } from '../contexts/CartContext';

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function CartSidebar({ open, onClose }: CartSidebarProps) {
  const { items, total, fetchCart, updateItem, removeItem, isLoading } = useCart();

  useEffect(() => {
    if (open) {
      fetchCart();
    }
  }, [open, fetchCart]);

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
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#111111] text-white shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#F77F00]">Carrinho</p>
            <h2 className="mt-2 text-2xl font-bold">Seu pedido</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#F77F00] px-4 py-2 text-sm font-semibold text-[#F77F00] transition hover:bg-[#F77F00]/15"
          >
            Fechar
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isLoading ? (
            <div className="text-center text-gray-300">Atualizando carrinho...</div>
          ) : items.length === 0 ? (
            <div className="space-y-4 text-center text-gray-300">
              <p className="text-lg font-semibold">Seu carrinho está vazio</p>
              <p className="text-sm text-[#cccccc]">Adicione hambúrgueres e combos deliciosos agora mesmo.</p>
              <Link
                href="/products"
                className="inline-flex rounded-full bg-[#F77F00] px-5 py-3 text-sm font-semibold text-[#000000] transition hover:bg-[#e06f00]"
                onClick={onClose}
              >
                Ver Cardápio
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map((item) => (
                <div key={item.id} className="rounded-[1.75rem] border border-[#ffffff1a] bg-[#191919] p-4 shadow-lg shadow-black/20">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-3xl bg-[#F77F00]/15 p-3 text-2xl flex items-center justify-center">
                      🍔
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white">{item.product?.name}</p>
                      <p className="text-sm text-gray-400">R$ {item.product?.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 rounded-full border border-[#ffffff1a] bg-white/5 px-3 py-2">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="rounded-full bg-[#F77F00]/15 px-3 py-1 text-base font-bold text-white transition hover:bg-[#F77F00]/25"
                      >
                        −
                      </button>
                      <span className="min-w-[32px] text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="rounded-full bg-[#F77F00]/15 px-3 py-1 text-base font-bold text-white transition hover:bg-[#F77F00]/25"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-sm font-semibold text-[#D62828] transition hover:text-[#ff6b6b]"
                    >
                      Remover
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
                    <span>Subtotal</span>
                    <span>R$ {((item.product?.price ?? 0) * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-white/10 p-6">
          <div className="flex items-center justify-between text-sm text-gray-300">
            <span>Subtotal</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <div className="mt-6 space-y-3">
            <Link
              href="/products"
              onClick={onClose}
              className="block rounded-full bg-[#F77F00] px-6 py-3 text-center text-sm font-semibold text-[#000000] transition hover:bg-[#e06f00]"
            >
              Continuar comprando
            </Link>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block rounded-full bg-[#D62828] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#b11f1f]"
            >
              Finalizar pedido
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
