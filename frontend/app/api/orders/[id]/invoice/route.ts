import { NextRequest } from 'next/server';
import { OrderService } from '@/lib/order-service';
import { authenticateToken } from '@/lib/auth-middleware';
import { handleApiError, notFoundResponse, successResponse } from '@/lib/api-helpers';
import {
  getInvoiceAccessKey,
  getInvoiceNumber,
  getOrderSubtotal
} from '@/lib/invoice';

const orderService = new OrderService();

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const user = authenticateToken(request);
    const order = await orderService.getOrderById(
      id,
      user.role === 'ADMIN' ? undefined : user.userId
    );

    if (!order) {
      return notFoundResponse('Pedido');
    }

    const subtotal = getOrderSubtotal(order);

    return successResponse({
        number: getInvoiceNumber(order),
        accessKey: getInvoiceAccessKey(order),
        issuedAt: order.createdAt,
        seller: {
          name: 'NANDS Burguer',
          document: '00.000.000/0001-00',
          address: 'Rua do Hamburguer, 123'
        },
        customer: {
          name: order.user?.name || 'Cliente',
          email: order.user?.email || ''
        },
        order: {
          id: order.id,
          status: order.status
        },
        items: order.items?.map((item) => ({
          id: item.id,
          name: item.product?.name || 'Produto',
          category: item.product?.category?.name || 'Sem categoria',
          quantity: item.quantity,
          unitPrice: item.price,
          total: item.quantity * Number(item.price)
        })) || [],
        totals: {
          subtotal,
          deliveryFee: 0,
          discount: 0,
          total: order.total
        },
        note: 'Nota fiscal simplificada para controle interno do projeto.'
      });
  } catch (error) {
    return handleApiError(error);
  }
}
