import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/lib/order-service';
import { authenticateToken } from '@/lib/auth-middleware';

const orderService = new OrderService();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = authenticateToken(request);

    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can update order status' },
        { status: 403 }
      );
    }

    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const validStatuses = ['PENDING', 'PAID', 'FAILED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Use: PENDING, PAID, FAILED, CANCELLED' },
        { status: 400 }
      );
    }

    const order = await orderService.updateOrderStatus(params.id, status);
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
