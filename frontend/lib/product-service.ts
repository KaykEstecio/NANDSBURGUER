import { prisma } from './prisma';

export class ProductService {
  async getProducts(skip = 0, take = 10, categoryId?: string) {
    const where: any = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const products = await prisma.product.findMany({
      where,
      skip,
      take,
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.product.count({ where });

    return { products, total };
  }

  async getProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true }
    });
  }

  async createProduct(data: any, userId: string) {
    return prisma.product.create({
      data: {
        ...data,
        createdById: userId
      },
      include: { category: true }
    });
  }

  async updateProduct(id: string, data: any) {
    return prisma.product.update({
      where: { id },
      data,
      include: { category: true }
    });
  }

  async deleteProduct(id: string) {
    return prisma.product.delete({
      where: { id }
    });
  }

  async decreaseStock(productId: string, quantity: number) {
    return prisma.product.update({
      where: { id: productId },
      data: {
        stock: {
          decrement: quantity
        }
      }
    });
  }

  async getStock(productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true }
    });

    return product?.stock || 0;
  }
}
