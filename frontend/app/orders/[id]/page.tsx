'use client';

import { useEffect, useState } from 'react';
import { useOrders } from '../../../contexts/OrderContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Order } from '../../../types';

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { fetchOrder } = useOrders();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    async function loadOrder() {
      setIsLoading(true);
      const data = await fetchOrder(params.id);
      setOrder(data);
      setIsLoading(false);
    }

    loadOrder();
  }, [params.id, isAuthenticated, fetchOrder, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return <div className="py-12 text-center">Carregando pedido...</div>;
  }

  if (!order) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600 text-lg">Pedido não encontrado</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold">Pedido #{order.id}</h1>
                <p className="text-gray-600 mt-2">
                  Data: {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">
                  R$ {order.total.toFixed(2)}
                </p>
                <span
                  className={`inline-block px-4 py-2 rounded text-sm mt-2 font-semibold ${
                    order.status === 'PAID'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'CANCELLED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.status === 'PAID'
                    ? 'Pago'
                    : order.status === 'PENDING'
                    ? 'Pendente'
                    : order.status === 'FAILED'
                    ? 'Falhou'
                    : 'Cancelado'}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t pt-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Itens do Pedido</h2>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-4 border-b">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.product?.name}</h3>
                    <p className="text-gray-600 text-sm">
                      Categoria: {item.product?.category?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">Quantidade: {item.quantity}</p>
                    <p className="font-semibold">R$ {item.price.toFixed(2)}</p>
                    <p className="text-gray-600 text-sm">
                      Subtotal: R$ {(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Resumo</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete:</span>
                <span>Grátis</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>R$ {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-bold mb-4">Informações de Entrega</h2>
            <p className="text-gray-600 mb-4">
              {order.status === 'PAID'
                ? 'Seu pedido foi confirmado e será enviado em breve.'
                : 'Realize o pagamento para que seu pedido seja processado.'}
            </p>
          </div>

          <div className="mt-8 pt-8 border-t flex gap-4">
            <button
              onClick={() => router.back()}
              className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-50 font-semibold"
            >
              Voltar
            </button>
            <button
              onClick={() => router.push('/products')}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 font-semibold"
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
