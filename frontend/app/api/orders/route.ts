import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/lib/order-service';
import { authenticateToken } from '@/lib/auth-middleware';

const orderService = new OrderService();

export async function GET(request: NextRequest) {
  try {
    const user = authenticateToken(request);
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip') || '0');
    const take = parseInt(searchParams.get('take') || '10');

    // Se for ADMIN, retorna todos os pedidos
    if (user.role === 'ADMIN') {
      const orders = await orderService.getAllOrders(skip, take);
      return NextResponse.json(orders, { status: 200 });
    }

    // Se for USER, retorna apenas seus pedidos
    const orders = await orderService.getOrders(user.userId);
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 401 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = authenticateToken(request);
    const order = await orderService.createOrder(user.userId);
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
