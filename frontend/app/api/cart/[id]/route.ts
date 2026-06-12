import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/lib/cart-service';
import { authenticateToken } from '@/lib/auth-middleware';

const cartService = new CartService();

export async function PUT(request: NextRequest) {
  try {
    const user = authenticateToken(request);
    const { productId, quantity } = await request.json();

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      await cartService.removeFromCart(user.userId, productId);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const item = await cartService.updateCartItem(user.userId, productId, quantity);
    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
