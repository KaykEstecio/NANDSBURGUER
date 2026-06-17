'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrders } from '../../../contexts/OrderContext';
import { useAuth } from '../../../contexts/AuthContext';
import { apiClient } from '../../../services/api';
import { Order } from '../../../types';
import {
  formatCurrency,
  formatDateTime,
  getDisplayOrderNumber,
  getInvoiceAccessKey,
  getInvoiceNumber,
  getOrderSubtotal
} from '../../../lib/invoice';

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { fetchOrder } = useOrders();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [invoice, setInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    async function loadOrder() {
      setIsLoading(true);
      const data = await fetchOrder(params.id);
      setOrder(data);

      if (data) {
        const invoiceData = await apiClient.getInvoice(data.id);
        setInvoice(invoiceData);
      }

      setIsLoading(false);
    }

    loadOrder();
  }, [params.id, isAuthLoading, isAuthenticated, fetchOrder, router]);

  if (isAuthLoading || !isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return <div className="py-12 text-center">Carregando pedido...</div>;
  }

  if (!order) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-gray-600">Pedido nao encontrado</p>
      </div>
    );
  }

  const invoiceNumber = invoice?.number || getInvoiceNumber(order);
  const accessKey = invoice?.accessKey || getInvoiceAccessKey(order);
  const subtotal = invoice?.totals?.subtotal || getOrderSubtotal(order);

  return (
    <div className="space-y-8 py-8">
      <section className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Pedido confirmado</p>
            <h1 className="mt-3 text-4xl font-bold">Pedido #{getDisplayOrderNumber(order)}</h1>
            <p className="mt-2 text-gray-600">Criado em {formatDateTime(order.createdAt)}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-3xl font-bold text-[#D62828]">{formatCurrency(order.total)}</p>
            <span className="mt-3 inline-flex rounded-full bg-[#F77F00]/15 px-4 py-2 text-sm font-semibold text-[#111]">
              {order.status === 'PENDING' ? 'Recebido' : order.status}
            </span>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
          <h2 className="text-2xl font-bold">Itens do pedido</h2>
          <div className="mt-6 space-y-4">
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 rounded-3xl border border-[#eee] p-4">
                <div>
                  <p className="font-semibold text-[#111]">{item.product?.name}</p>
                  <p className="text-sm text-gray-500">{item.product?.category?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{item.quantity} x {formatCurrency(item.price)}</p>
                  <p className="font-bold text-[#D62828]">{formatCurrency(item.quantity * item.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[2rem] bg-[#000] p-8 text-white shadow-xl shadow-black/10">
            <h2 className="text-2xl font-bold">Resumo</h2>
            <div className="mt-6 space-y-3 text-sm text-gray-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span>Gratis</span>
              </div>
              <div className="border-t border-white/20 pt-4 text-lg font-bold">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="print-invoice rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5 print:shadow-none">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Nota fiscal</p>
                <h2 className="mt-2 text-2xl font-bold">{invoiceNumber}</h2>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="print-hide rounded-full bg-[#F77F00] px-4 py-2 text-sm font-semibold text-[#000] print:hidden"
              >
                Imprimir
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div>
                <p className="font-semibold text-[#111]">NANDS Burguer</p>
                <p className="text-gray-500">CNPJ: 00.000.000/0001-00</p>
                <p className="text-gray-500">Rua do Hamburguer, 123</p>
              </div>

              <div className="rounded-2xl bg-[#f9f1e8] p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-[#D62828]">Cliente</p>
                <p className="mt-2 font-semibold">{order.user?.name || invoice?.customer?.name || 'Cliente'}</p>
                <p className="text-gray-500">{order.user?.email || invoice?.customer?.email}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#D62828]">Chave de acesso</p>
                <p className="mt-2 break-all font-mono text-xs text-gray-600">{accessKey}</p>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span>Total da nota</span>
                  <strong>{formatCurrency(order.total)}</strong>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                Nota fiscal simplificada para controle interno do projeto.
              </p>
            </div>
          </section>
        </aside>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => router.push('/orders')}
          className="rounded-full border border-[#ddd] bg-white px-6 py-3 text-sm font-semibold text-[#111] transition hover:bg-[#faf3ed]"
        >
          Ver meus pedidos
        </button>
        <button
          onClick={() => router.push('/products')}
          className="rounded-full bg-[#D62828] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b11f1f]"
        >
          Continuar comprando
        </button>
      </div>
    </div>
  );
}
