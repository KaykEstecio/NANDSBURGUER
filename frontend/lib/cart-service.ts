import { prisma } from './prisma';

export class CartService {
  async getCart(userId: string) {
    return prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async addToCart(userId: string, productId: string, quantity: number) {
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    });

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
    return prisma.cartItem.delete({
      where: {
        userId_productId: { userId, productId }
      }
    });
  }

  async updateCartItem(userId: string, productId: string, quantity: number) {
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

    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }
}
