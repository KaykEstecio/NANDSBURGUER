'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import { useOrders } from '../../contexts/OrderContext';
import { useAuth } from '../../contexts/AuthContext';

function getProductImage(categoryName: string | undefined, name: string) {
  const category = categoryName?.toLowerCase() || '';
  const productName = name.toLowerCase();

  if (category.includes('bebida') || productName.includes('drink') || productName.includes('refrigerante') || productName.includes('suco')) {
    return 'https://images.unsplash.com/photo-1542444459-db4d46b2b6f7?auto=format&fit=crop&w=900&q=80';
  }

  if (category.includes('combo') || productName.includes('combo')) {
    return 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80';
  }

  return 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80';
}

export default function CheckoutPage() {
  const { items, total } = useCart();
  const { createOrder } = useOrders();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'pix'>('card');
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [isAuthenticated, items.length, router]);

  async function handleCreateOrder() {
    setIsLoading(true);
    setError('');

    try {
      await createOrder();
      router.push('/orders');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar pedido');
    } finally {
      setIsLoading(false);
    }
  }

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-10">
      <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
        <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Checkout</p>
        <h1 className="mt-3 text-4xl font-bold">Finalize seu pedido</h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          Escolha retirada ou delivery, informe seus dados e conclua com um pagamento rápido.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
            <h2 className="text-2xl font-bold mb-4">Opções de entrega</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                onClick={() => setDeliveryType('pickup')}
                className={`rounded-3xl border px-6 py-5 text-left transition ${deliveryType === 'pickup' ? 'border-[#D62828] bg-[#F77F00]/10' : 'border-[#ddd] bg-[#faf3ed]'}`}
              >
                <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Retirada</p>
                <p className="mt-2 text-lg font-semibold">No balcão</p>
                <p className="mt-2 text-sm text-gray-600">Retire seu pedido na loja mais rápida.</p>
              </button>
              <button
                onClick={() => setDeliveryType('delivery')}
                className={`rounded-3xl border px-6 py-5 text-left transition ${deliveryType === 'delivery' ? 'border-[#D62828] bg-[#F77F00]/10' : 'border-[#ddd] bg-[#faf3ed]'}`}
              >
                <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Delivery</p>
                <p className="mt-2 text-lg font-semibold">Entrega</p>
                <p className="mt-2 text-sm text-gray-600">Receba em casa com frete grátis.</p>
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
            <h2 className="text-2xl font-bold mb-4">Dados do cliente</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Nome Completo"
                value={customerData.name}
                onChange={(event) => setCustomerData({ ...customerData, name: event.target.value })}
                className="rounded-3xl border border-[#ddd] px-5 py-4"
              />
              <input
                type="email"
                placeholder="Email"
                value={customerData.email}
                onChange={(event) => setCustomerData({ ...customerData, email: event.target.value })}
                className="rounded-3xl border border-[#ddd] px-5 py-4"
              />
            </div>

            {deliveryType === 'delivery' && (
              <div className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="CEP"
                    value={customerData.cep}
                    onChange={(event) => setCustomerData({ ...customerData, cep: event.target.value })}
                    className="rounded-3xl border border-[#ddd] px-5 py-4"
                  />
                  <input
                    type="text"
                    placeholder="Rua"
                    value={customerData.street}
                    onChange={(event) => setCustomerData({ ...customerData, street: event.target.value })}
                    className="rounded-3xl border border-[#ddd] px-5 py-4"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <input
                    type="text"
                    placeholder="Número"
                    value={customerData.number}
                    onChange={(event) => setCustomerData({ ...customerData, number: event.target.value })}
                    className="rounded-3xl border border-[#ddd] px-5 py-4"
                  />
                  <input
                    type="text"
                    placeholder="Complemento"
                    value={customerData.complement}
                    onChange={(event) => setCustomerData({ ...customerData, complement: event.target.value })}
                    className="rounded-3xl border border-[#ddd] px-5 py-4"
                  />
                  <input
                    type="text"
                    placeholder="Bairro"
                    value={customerData.district}
                    onChange={(event) => setCustomerData({ ...customerData, district: event.target.value })}
                    className="rounded-3xl border border-[#ddd] px-5 py-4"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Cidade"
                    value={customerData.city}
                    onChange={(event) => setCustomerData({ ...customerData, city: event.target.value })}
                    className="rounded-3xl border border-[#ddd] px-5 py-4"
                  />
                  <input
                    type="text"
                    placeholder="Estado"
                    value={customerData.state}
                    onChange={(event) => setCustomerData({ ...customerData, state: event.target.value })}
                    className="rounded-3xl border border-[#ddd] px-5 py-4"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] bg-[#000000] p-8 text-white shadow-xl shadow-black/10">
            <h2 className="text-2xl font-bold mb-4">Resumo do Pedido</h2>
            <div className="space-y-4 text-sm text-gray-200">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div
                      className="h-16 w-16 rounded-3xl bg-cover bg-center"
                      style={{ backgroundImage: `url(${getProductImage(item.product?.category?.name, item.product?.name || '')})` }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white">{item.product?.name}</p>
                      <p className="text-sm text-gray-300">Qtd: {item.quantity}</p>
                    </div>
                    <div className="text-right text-sm font-semibold text-white">
                      R$ {((item.product?.price ?? 0) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

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
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
            <h2 className="text-2xl font-bold mb-4">Pagamento</h2>
            <div className="space-y-3 text-sm text-gray-700">
              {['card', 'cash', 'pix'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPaymentMethod(option as 'card' | 'cash' | 'pix')}
                  className={`w-full rounded-3xl border px-5 py-4 text-left transition ${paymentMethod === option ? 'border-[#D62828] bg-[#F77F00]/10' : 'border-[#ddd] bg-[#faf3ed]'}`}
                >
                  <p className="font-semibold text-[#111]">{option === 'card' ? 'Cartão' : option === 'cash' ? 'Dinheiro' : 'PIX'}</p>
                  <p className="mt-2 text-sm text-gray-500">{option === 'card' ? 'Pagamento simulado com cartão' : option === 'cash' ? 'Pagamento na entrega/retirada' : 'Pagamento rápido via PIX'}</p>
                </button>
              ))}
            </div>
          </div>

          {error && <div className="rounded-3xl bg-[#ffe3e1] p-4 text-sm text-[#a11e1c]">{error}</div>}

          <button
            onClick={handleCreateOrder}
            disabled={isLoading}
            className="w-full rounded-full bg-[#D62828] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#b11f1f] disabled:cursor-not-allowed disabled:bg-[#ffa39b]"
          >
            {isLoading ? 'Finalizando pedido...' : 'Confirmar pedido'}
          </button>

          <button
            onClick={() => router.back()}
            className="w-full rounded-full border border-[#ddd] bg-white px-6 py-4 text-base font-semibold text-[#111] transition hover:bg-[#faf3ed]"
          >
            Voltar ao carrinho
          </button>
        </aside>
      </div>
    </div>
  );
}
