import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/lib/cart-service';
import { authenticateToken } from '@/lib/auth-middleware';

const cartService = new CartService();

export async function GET(request: NextRequest) {
  try {
    const user = authenticateToken(request);
    const items = await cartService.getCart(user.userId);
    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    
    return NextResponse.json({ items, total }, { status: 200 });
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
    const { productId, quantity } = await request.json();

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }

    const item = await cartService.addToCart(user.userId, productId, quantity);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = authenticateToken(request);
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      await cartService.clearCart(user.userId);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    await cartService.removeFromCart(user.userId, productId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
