import { prisma } from '../config/database';

interface AddToCartInput {
  userId: string;
  productId: string;
  quantity: number;
}

interface UpdateCartItemInput {
  quantity: number;
}

export class CartService {
  async getCart(userId: string) {
    return prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    });
  }

  async addItem(input: AddToCartInput) {
    const product = await prisma.product.findUnique({
      where: { id: input.productId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < input.quantity) {
      throw new Error('Insufficient stock');
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: input.userId,
          productId: input.productId
        }
      }
    });

    if (existingItem) {
      return prisma.cartItem.update({
        where: {
          userId_productId: {
            userId: input.userId,
            productId: input.productId
          }
        },
        data: {
          quantity: existingItem.quantity + input.quantity
        },
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      });
    }

    return prisma.cartItem.create({
      data: input,
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    });
  }

  async updateItem(userId: string, productId: string, input: UpdateCartItemInput) {
    if (input.quantity <= 0) {
      return this.removeItem(userId, productId);
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product || product.stock < input.quantity) {
      throw new Error('Insufficient stock');
    }

    return prisma.cartItem.update({
      where: {
        userId_productId: {
          userId,
          productId
        }
      },
      data: input,
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    });
  }

  async removeItem(userId: string, productId: string) {
    return prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
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
      include: {
        product: true
      }
    });

    return items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }
}
