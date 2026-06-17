import { NextRequest } from 'next/server';
import { OrderService } from '@/lib/order-service';
import { authenticateToken } from '@/lib/auth-middleware';
import { handleApiError, notFoundResponse, successResponse } from '@/lib/api-helpers';

const orderService = new OrderService();

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
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

    return successResponse(order);
  } catch (error) {
    return handleApiError(error);
  }
}
