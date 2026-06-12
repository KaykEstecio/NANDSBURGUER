import { prisma } from './prisma';
import { CartService } from './cart-service';
import { ProductService } from './product-service';

const cartService = new CartService();
const productService = new ProductService();

export class OrderService {
  async createOrder(userId: string) {
    const cart = await cartService.getCart(userId);

    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }

    for (const item of cart) {
      if (item.product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${item.product.name}`);
      }
    }

    const total = await cartService.getCartTotal(userId);

    const order = await prisma.order.create({
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
      include: {
        items: {
          include: { product: { include: { category: true } } }
        }
      }
    });

    for (const item of cart) {
      await productService.decreaseStock(item.productId, item.quantity);
    }

    await cartService.clearCart(userId);

    return order;
  }

  async getOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: { include: { category: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getOrderById(id: string, userId?: string) {
    const where: any = { id };
    if (userId) where.userId = userId;

    return prisma.order.findUnique({
      where,
      include: {
        items: {
          include: { product: { include: { category: true } } }
        }
      }
    });
  }

  async getAllOrders(skip = 0, take = 10) {
    return prisma.order.findMany({
      skip,
      take,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: { product: { include: { category: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateOrderStatus(id: string, status: string) {
    const validStatuses = ['PENDING', 'PAID', 'FAILED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    return prisma.order.update({
      where: { id },
      data: { status: status as any },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: { product: { include: { category: true } } }
        }
      }
    });
  }
}
