import { NextRequest } from 'next/server';
import { OrderService } from '@/lib/order-service';
import { authenticateToken } from '@/lib/auth-middleware';
import { forbiddenResponse, handleApiError, successResponse } from '@/lib/api-helpers';
import { orderStatusSchema } from '@/lib/validators';

const orderService = new OrderService();

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const user = authenticateToken(request);

    if (user.role !== 'ADMIN') {
      return forbiddenResponse();
    }

    const { status } = orderStatusSchema.parse(await request.json());

    const order = await orderService.updateOrderStatus(id, status);
    return successResponse(order);
  } catch (error) {
    return handleApiError(error);
  }
}
