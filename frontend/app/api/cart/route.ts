import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/lib/cart-service';
import { authenticateToken } from '@/lib/auth-middleware';

const cartService = new CartService();

export async function GET(request: NextRequest) {
  try {
    const user = authenticateToken(request);
    const cart = await cartService.getCart(user.userId);
    
    return NextResponse.json(cart, { status: 200 });
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
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
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
