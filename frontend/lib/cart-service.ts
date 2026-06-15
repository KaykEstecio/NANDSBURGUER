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
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    });

    const nextQuantity = (existingItem?.quantity || 0) + quantity;
    if (nextQuantity > product.stock) {
      throw new Error('Insufficient stock');
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
      throw new Error('Product not found');
    }

    if (quantity > product.stock) {
      throw new Error('Insufficient stock');
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

    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }
}
