import { prisma } from './prisma';
import { ApiError } from './api-helpers';
import { calculateCartTotal } from './order-rules';

export class CartService {
  async getCart(userId: string) {
    return prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async addToCart(userId: string, productId: string, quantity: number) {
    if (quantity <= 0) {
      throw new ApiError('Quantidade deve ser maior que zero', 400, 'INVALID_QUANTITY');
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new ApiError('Produto nao encontrado', 404, 'PRODUCT_NOT_FOUND');
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    });

    const nextQuantity = (existingItem?.quantity || 0) + quantity;
    if (nextQuantity > product.stock) {
      throw new ApiError('Estoque insuficiente', 409, 'INSUFFICIENT_STOCK');
    }

    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: { increment: quantity } },
        include: { product: true }
      });
    }

    return prisma.cartItem.create({
      data: { userId, productId, quantity },
      include: { product: true }
    });
  }

  async removeFromCart(userId: string, productId: string) {
    return prisma.cartItem.deleteMany({
      where: {
        userId,
        productId
      }
    });
  }

  async updateCartItem(userId: string, productId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(userId, productId);
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new ApiError('Produto nao encontrado', 404, 'PRODUCT_NOT_FOUND');
    }

    if (quantity > product.stock) {
      throw new ApiError('Estoque insuficiente', 409, 'INSUFFICIENT_STOCK');
    }

    return prisma.cartItem.update({
      where: {
        userId_productId: { userId, productId }
      },
      data: { quantity },
      include: { product: true }
    });
  }

  async clearCart(userId: string) {
    return prisma.cartItem.deleteMany({
      where: { userId }
    });
  }

  async getCartTotal(userId: string) {
    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });

    return calculateCartTotal(items);
  }
}
