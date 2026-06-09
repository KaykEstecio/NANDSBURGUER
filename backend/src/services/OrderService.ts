import { prisma } from '../config/database';
import { CartService } from './CartService';
import { ProductService } from './ProductService';

const cartService = new CartService();
const productService = new ProductService();

interface CreateOrderInput {
  userId: string;
}

export class OrderService {
  async createOrder(input: CreateOrderInput) {
    const cart = await cartService.getCart(input.userId);

    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }

    // Validate stock for all items
    for (const item of cart) {
      if (item.product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${item.product.name}`);
      }
    }

    // Create order
    const total = await cartService.getCartTotal(input.userId);

    const order = await prisma.order.create({
      data: {
        userId: input.userId,
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
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });

    // Decrease stock
    for (const item of cart) {
      await productService.decreaseStock(item.productId, item.quantity);
    }

    // Clear cart
    await cartService.clearCart(input.userId);

    return order;
  }

  async getOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getOrderById(id: string, userId?: string) {
    const where: any = { id };
    if (userId) {
      where.userId = userId;
    }

    return prisma.order.findUnique({
      where,
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
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
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });
  }

  async getAllOrders(skip = 0, take = 10) {
    return prisma.order.findMany({
      skip,
      take,
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
