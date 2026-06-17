import { NextRequest } from 'next/server';
import { CartService } from '@/lib/cart-service';
import { authenticateToken } from '@/lib/auth-middleware';
import { handleApiError, successResponse } from '@/lib/api-helpers';
import { cartItemUpdateSchema } from '@/lib/validators';

const cartService = new CartService();

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const user = authenticateToken(request);
    const input = cartItemUpdateSchema.parse(await request.json());
    const productId = input.productId ?? id;
    const { quantity } = input;

    if (quantity <= 0) {
      await cartService.removeFromCart(user.userId, productId);
      return successResponse({ removed: true });
    }

    const item = await cartService.updateCartItem(user.userId, productId, quantity);
    return successResponse(item);
  } catch (error) {
    return handleApiError(error);
  }
}
