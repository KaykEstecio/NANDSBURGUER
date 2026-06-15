import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/lib/order-service';
import { authenticateToken } from '@/lib/auth-middleware';

const orderService = new OrderService();

type RouteContext = {
  params: { id: string } | Promise<{ id: string }>;
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
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
