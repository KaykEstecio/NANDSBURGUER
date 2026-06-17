import { OrderStatus, Prisma } from '@prisma/client';
import { ApiError } from './api-helpers';
import { assertCartCanCheckout, calculateCartTotal } from './order-rules';
import { prisma } from './prisma';

const orderInclude = {
  user: { select: { id: true, name: true, email: true } },
  items: {
    include: { product: { include: { category: true } } }
  }
} satisfies Prisma.OrderInclude;

export class OrderService {
  async createOrder(userId: string) {
    return prisma.$transaction(async (tx) => {
      const cart = await tx.cartItem.findMany({
        where: { userId },
        include: { product: true },
        orderBy: { createdAt: 'desc' }
      });

      try {
        assertCartCanCheckout(cart);
      } catch (error) {
        throw new ApiError(
          error instanceof Error ? error.message : 'Carrinho invalido',
          cart.length === 0 ? 400 : 409,
          cart.length === 0 ? 'EMPTY_CART' : 'INSUFFICIENT_STOCK'
        );
      }

      const total = calculateCartTotal(cart);

      for (const item of cart) {
        const updated = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } }
        });

        if (updated.count === 0) {
          throw new ApiError(
            `Estoque insuficiente para ${item.product.name}`,
            409,
            'INSUFFICIENT_STOCK'
          );
        }
      }

      const order = await tx.order.create({
        data: {
          userId,
          status: 'PENDING',
          total,
          items: {
            create: cart.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price
            }))
          }
        },
        include: orderInclude
      });

      await tx.cartItem.deleteMany({ where: { userId } });

      return order;
    });
  }

  async getOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: orderInclude,
      orderBy: { createdAt: 'desc' }
    });
  }

  async getOrderById(id: string, userId?: string) {
    const where: Prisma.OrderWhereInput = { id };
    if (userId) where.userId = userId;

    return prisma.order.findFirst({
      where,
      include: orderInclude
    });
  }

  async getAllOrders(skip = 0, take = 10) {
    return prisma.order.findMany({
      skip,
      take,
      include: orderInclude,
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id },
      data: { status },
      include: orderInclude
    });
  }
}
