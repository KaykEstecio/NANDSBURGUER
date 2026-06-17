import { NextRequest } from 'next/server';
import { CartService } from '@/lib/cart-service';
import { authenticateToken } from '@/lib/auth-middleware';
import { handleApiError, successResponse, createdResponse } from '@/lib/api-helpers';
import { cartItemSchema } from '@/lib/validators';
import { calculateCartTotal } from '@/lib/order-rules';

const cartService = new CartService();

export async function GET(request: NextRequest) {
  try {
    const user = authenticateToken(request);
    const items = await cartService.getCart(user.userId);
    const total = calculateCartTotal(items);
    
    return successResponse({ items, total });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = authenticateToken(request);
    const { productId, quantity } = cartItemSchema.parse(await request.json());

    const item = await cartService.addToCart(user.userId, productId, quantity);
    return createdResponse(item);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = authenticateToken(request);
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      await cartService.clearCart(user.userId);
      return successResponse({ cleared: true });
    }

    await cartService.removeFromCart(user.userId, productId);
    return successResponse({ removed: true });
  } catch (error) {
    return handleApiError(error);
  }
}
