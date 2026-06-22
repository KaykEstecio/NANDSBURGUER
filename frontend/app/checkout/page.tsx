'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import { useOrders } from '../../contexts/OrderContext';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { cn, formatCurrency } from '../../lib/utils';

type DeliveryType = 'pickup' | 'delivery';
type PaymentMethod = 'card' | 'cash' | 'pix';

const paymentCopy: Record<PaymentMethod, { title: string; copy: string }> = {
  card: {
    title: 'Cartao',
    copy: 'Pagamento simulado com cartao na finalizacao.',
  },
  cash: {
    title: 'Dinheiro',
    copy: 'Pague na retirada ou na entrega.',
  },
  pix: {
    title: 'PIX',
    copy: 'Use a chave simulada depois de confirmar o pedido.',
  },
};

function getProductImage(categoryName: string | undefined, name: string) {
  const category = categoryName?.toLowerCase() || '';
  const productName = name.toLowerCase();

  if (
    category.includes('bebida') ||
    productName.includes('drink') ||
    productName.includes('refrigerante') ||
    productName.includes('suco')
  ) {
    return 'https://images.unsplash.com/photo-1542444459-db4d46b2b6f7?auto=format&fit=crop&w=900&q=80';
  }

  if (category.includes('combo') || productName.includes('combo')) {
    return 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80';
  }

  return 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80';
}

function inputClassName(hasError?: boolean) {
  return cn(
    'h-12 rounded-2xl border bg-background px-4 text-sm font-semibold text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/25',
    hasError ? 'border-primary bg-primary/[0.06]' : 'border-border'
  );
}

export default function CheckoutPage() {
  const { items, total, fetchCart } = useCart();
  const { createOrder } = useOrders();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirectingToOrder, setIsRedirectingToOrder] = useState(false);
  const [error, setError] = useState('');
  const [hasLoadedCart, setHasLoadedCart] = useState(false);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [touchedSubmit, setTouchedSubmit] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: '',
  });

  useEffect(() => {
    if (user) {
      setCustomerData((current) => ({
        ...current,
        name: current.name || user.name,
        email: current.email || user.email,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    fetchCart().finally(() => setHasLoadedCart(true));
  }, [isAuthLoading, isAuthenticated, fetchCart, router]);

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated || isLoading || isRedirectingToOrder || !hasLoadedCart) {
      return;
    }

    if (items.length === 0) {
      router.push('/cart');
    }
  }, [
    hasLoadedCart,
    isAuthLoading,
    isAuthenticated,
    isLoading,
    isRedirectingToOrder,
    items.length,
    router,
  ]);

  const validation = useMemo(() => {
    const missing: Partial<Record<keyof typeof customerData, boolean>> = {};

    if (!customerData.name.trim()) missing.name = true;
    if (!customerData.email.trim()) missing.email = true;

    if (deliveryType === 'delivery') {
      if (!customerData.cep.trim()) missing.cep = true;
      if (!customerData.street.trim()) missing.street = true;
      if (!customerData.number.trim()) missing.number = true;
      if (!customerData.district.trim()) missing.district = true;
      if (!customerData.city.trim()) missing.city = true;
      if (!customerData.state.trim()) missing.state = true;
    }

    return missing;
  }, [customerData, deliveryType]);

  const hasValidationError = Object.keys(validation).length > 0;

  async function handleCreateOrder() {
    setTouchedSubmit(true);
    setError('');

    if (hasValidationError) {
      setError('Preencha os dados obrigatorios para continuar com o pagamento.');
      return;
    }

    setIsLoading(true);

    try {
      const order = await createOrder();
      setIsRedirectingToOrder(true);
      await fetchCart();
      router.push(`/orders/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar pedido');
    } finally {
      setIsLoading(false);
    }
  }

  if (isAuthLoading || !isAuthenticated || !hasLoadedCart || items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8 pb-28 lg:pb-8">
      <section className="overflow-hidden rounded-[1.5rem] bg-[#15110f] text-white shadow-grill">
        <div className="burger-noise grid gap-5 p-6 sm:p-8 lg:grid-cols-[1fr_0.42fr] lg:items-end">
          <div>
            <Badge variant="secondary" className="border-0">
              Checkout
            </Badge>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-none sm:text-5xl">
              Finalize o pedido sem tirar o olho da fome.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/[0.72] sm:text-base">
              Revise entrega, informe os dados essenciais e escolha o jeito de pagar. A Nands
              prepara o pedido assim que ele for confirmado.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-2">
            {['Dados', 'Pagamento', 'Pedido'].map((step, index) => (
              <div key={step} className="rounded-2xl bg-white/[0.06] px-3 py-3 text-center">
                <p className="text-lg font-black text-secondary">{index + 1}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/[0.62]">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)] lg:items-start">
        <div className="flex flex-col gap-6">
          <Card className="rounded-[1.25rem] shadow-sm">
            <CardHeader>
              <CardTitle>Entrega</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  value: 'pickup' as const,
                  label: 'Retirada no balcao',
                  copy: 'Mais rapido para buscar na loja.',
                },
                {
                  value: 'delivery' as const,
                  label: 'Delivery',
                  copy: 'Receba em casa com frete gratis.',
                },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDeliveryType(option.value)}
                  className={cn(
                    'rounded-[1.25rem] border p-5 text-left transition',
                    deliveryType === option.value
                      ? 'border-primary bg-primary/[0.06] shadow-lg shadow-primary/10'
                      : 'border-border bg-background hover:border-primary/45'
                  )}
                >
                  <p className="text-sm font-black uppercase tracking-[0.12em] text-primary">
                    {option.value === 'pickup' ? 'Retirada' : 'Entrega'}
                  </p>
                  <p className="mt-2 text-lg font-black text-foreground">{option.label}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{option.copy}</p>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[1.25rem] shadow-sm">
            <CardHeader>
              <CardTitle>Dados do cliente</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={customerData.name}
                  onChange={(event) =>
                    setCustomerData({ ...customerData, name: event.target.value })
                  }
                  className={inputClassName(touchedSubmit && validation.name)}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={customerData.email}
                  onChange={(event) =>
                    setCustomerData({ ...customerData, email: event.target.value })
                  }
                  className={inputClassName(touchedSubmit && validation.email)}
                />
              </div>

              {deliveryType === 'delivery' && (
                <div className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-[0.7fr_1.3fr]">
                    <input
                      type="text"
                      placeholder="CEP"
                      value={customerData.cep}
                      onChange={(event) =>
                        setCustomerData({ ...customerData, cep: event.target.value })
                      }
                      className={inputClassName(touchedSubmit && validation.cep)}
                    />
                    <input
                      type="text"
                      placeholder="Rua"
                      value={customerData.street}
                      onChange={(event) =>
                        setCustomerData({ ...customerData, street: event.target.value })
                      }
                      className={inputClassName(touchedSubmit && validation.street)}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <input
                      type="text"
                      placeholder="Numero"
                      value={customerData.number}
                      onChange={(event) =>
                        setCustomerData({ ...customerData, number: event.target.value })
                      }
                      className={inputClassName(touchedSubmit && validation.number)}
                    />
                    <input
                      type="text"
                      placeholder="Complemento"
                      value={customerData.complement}
                      onChange={(event) =>
                        setCustomerData({ ...customerData, complement: event.target.value })
                      }
                      className={inputClassName()}
                    />
                    <input
                      type="text"
                      placeholder="Bairro"
                      value={customerData.district}
                      onChange={(event) =>
                        setCustomerData({ ...customerData, district: event.target.value })
                      }
                      className={inputClassName(touchedSubmit && validation.district)}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-[1fr_0.5fr]">
                    <input
                      type="text"
                      placeholder="Cidade"
                      value={customerData.city}
                      onChange={(event) =>
                        setCustomerData({ ...customerData, city: event.target.value })
                      }
                      className={inputClassName(touchedSubmit && validation.city)}
                    />
                    <input
                      type="text"
                      placeholder="UF"
                      value={customerData.state}
                      onChange={(event) =>
                        setCustomerData({
                          ...customerData,
                          state: event.target.value.toUpperCase().slice(0, 2),
                        })
                      }
                      className={inputClassName(touchedSubmit && validation.state)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[1.25rem] shadow-sm">
            <CardHeader>
              <CardTitle>Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {(Object.keys(paymentCopy) as PaymentMethod[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPaymentMethod(option)}
                  className={cn(
                    'flex items-start justify-between gap-4 rounded-[1.25rem] border p-4 text-left transition',
                    paymentMethod === option
                      ? 'border-primary bg-primary/[0.06] shadow-lg shadow-primary/10'
                      : 'border-border bg-background hover:border-primary/45'
                  )}
                >
                  <span>
                    <span className="block text-base font-black text-foreground">
                      {paymentCopy[option].title}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                      {paymentCopy[option].copy}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border',
                      paymentMethod === option
                        ? 'border-primary bg-primary'
                        : 'border-border bg-card'
                    )}
                  >
                    {paymentMethod === option && <span className="size-2 rounded-full bg-white" />}
                  </span>
                </button>
              ))}

              {paymentMethod === 'pix' && (
                <div className="rounded-[1.25rem] bg-muted p-4 text-sm text-muted-foreground">
                  Chave PIX simulada:{' '}
                  <strong className="text-foreground">pix@nandsburguer.local</strong>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-24">
          <Card className="overflow-hidden rounded-[1.25rem] bg-[#15110f] text-white shadow-grill">
            <CardHeader>
              <CardTitle>Resumo do pedido</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="menu-scrollbar max-h-[340px] overflow-y-auto pr-1">
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-[1rem] border border-white/10 bg-white/[0.06] p-3"
                    >
                      <div
                        className="size-14 shrink-0 rounded-2xl bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${getProductImage(
                            item.product?.category?.name,
                            item.product?.name || ''
                          )})`,
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-white">
                          {item.product?.name}
                        </p>
                        <p className="text-xs font-semibold text-white/[0.58]">
                          {item.quantity} x {formatCurrency(item.product?.price ?? 0)}
                        </p>
                      </div>
                      <p className="text-sm font-black text-secondary">
                        {formatCurrency((item.product?.price ?? 0) * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div className="flex flex-col gap-3 text-sm text-white/[0.72]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span>Gratis</span>
                </div>
                <div className="flex justify-between text-xl font-black text-white">
                  <span>Total</span>
                  <span className="text-secondary">{formatCurrency(total)}</span>
                </div>
              </div>

              {error && (
                <div className="rounded-2xl bg-primary/[0.16] p-4 text-sm font-semibold text-white">
                  {error}
                </div>
              )}

              <Button onClick={handleCreateOrder} disabled={isLoading} className="h-12 w-full">
                {isLoading ? 'Finalizando pedido...' : 'Confirmar e pagar'}
              </Button>
              <Button
                onClick={() => router.push('/cart')}
                variant="outline"
                className="h-11 w-full border-white/15 bg-white/[0.06] text-white hover:bg-white/10 hover:text-white"
              >
                Voltar ao carrinho
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 shadow-[0_-18px_40px_rgba(17,17,17,0.12)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
              Total
            </p>
            <p className="text-xl font-black text-primary">{formatCurrency(total)}</p>
          </div>
          <Button onClick={handleCreateOrder} disabled={isLoading} className="h-12 px-5">
            {isLoading ? 'Finalizando...' : 'Pagar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
