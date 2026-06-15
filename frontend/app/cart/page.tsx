'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, total, fetchCart, updateItem, removeItem, isLoading } = useCart();
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
    return <div className="py-12 text-center">Carregando carrinho...</div>;
  }

  return (
    <div className="space-y-10">
      <div className="rounded-[2rem] bg-white/95 p-8 shadow-xl shadow-black/5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Pedido</p>
            <h1 className="mt-3 text-4xl font-bold">Carrinho de Compras</h1>
          </div>
          <p className="text-sm text-gray-600 max-w-xl">
            Revise seus itens e finalize com retirada no balcão ou delivery.
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[2rem] bg-white p-12 text-center shadow-lg shadow-black/5">
          <p className="text-xl font-semibold text-gray-700 mb-4">Seu carrinho está vazio</p>
          <Link
            href="/products"
            className="inline-flex rounded-full bg-[#D62828] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#b11f1f]"
          >
            Continuar Comprando
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-[2rem] border border-[#f1e4db] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F77F00]/15 text-3xl">
                      🍔
                    </div>
                    <div>
                      <Link href={`/products/${item.productId}`}>
                        <h2 className="text-xl font-bold text-[#111] hover:text-[#D62828]">
                          {item.product?.name}
                        </h2>
                      </Link>
                      <p className="text-sm text-gray-500">R$ {item.product?.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center rounded-full border border-[#ddd] bg-[#f9f4ef]">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="px-4 py-2 text-lg text-[#111] transition hover:bg-[#f2e7dd] disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="px-5 py-2 text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="px-4 py-2 text-lg text-[#111] transition hover:bg-[#f2e7dd]"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#D62828]">R$ {((item.product?.price ?? 0) * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="mt-2 text-sm font-semibold text-[#D62828] hover:text-[#b11f1f]"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="sticky top-6 rounded-[2rem] border border-[#f1e4db] bg-[#000000] p-8 text-white shadow-xl shadow-black/10">
            <h2 className="text-2xl font-bold mb-6">Resumo do Pedido</h2>
            <div className="space-y-4 text-sm text-gray-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span>Grátis</span>
              </div>
              <div className="border-t border-white/20 pt-4 text-lg font-bold">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-8 block rounded-full bg-[#D62828] px-6 py-4 text-center text-base font-semibold text-white transition hover:bg-[#b11f1f]"
            >
              Finalizar Compra
            </Link>
            <Link
              href="/products"
              className="mt-4 block rounded-full border border-[#F77F00] bg-white text-center text-sm font-semibold text-[#000000] transition hover:bg-[#F77F00]/10"
            >
              Continuar Comprando
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
