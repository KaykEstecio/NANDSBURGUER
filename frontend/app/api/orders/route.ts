import { NextRequest } from 'next/server';
import { OrderService } from '@/lib/order-service';
import { authenticateToken } from '@/lib/auth-middleware';
import { createdResponse, handleApiError, successResponse } from '@/lib/api-helpers';
import { paginationQuerySchema } from '@/lib/validators';

const orderService = new OrderService();

export async function GET(request: NextRequest) {
  try {
    const user = authenticateToken(request);
    const { searchParams } = new URL(request.url);
    const query = paginationQuerySchema.parse({
      skip: searchParams.get('skip') ?? undefined,
      take: searchParams.get('take') ?? undefined
    });

    // Se for ADMIN, retorna todos os pedidos
    if (user.role === 'ADMIN') {
      const orders = await orderService.getAllOrders(query.skip, query.take);
      return successResponse(orders);
    }

    // Se for USER, retorna apenas seus pedidos
    const orders = await orderService.getOrders(user.userId);
    return successResponse(orders);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = authenticateToken(request);
    const order = await orderService.createOrder(user.userId);
    
    return createdResponse(order);
  } catch (error) {
    return handleApiError(error);
  }
}
