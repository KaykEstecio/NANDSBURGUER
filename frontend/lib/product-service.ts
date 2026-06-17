import { Prisma } from '@prisma/client';
import { ApiError } from './api-helpers';
import { prisma } from './prisma';
import { ProductCreateInput, ProductUpdateInput } from './validators';

export class ProductService {
  async getProducts(skip = 0, take = 10, categoryId?: string) {
    const where: Prisma.ProductWhereInput = {};
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

  async createProduct(data: ProductCreateInput, userId: string) {
    return prisma.product.create({
      data: {
        ...data,
        createdById: userId
      },
      include: { category: true }
    });
  }

  async updateProduct(id: string, data: ProductUpdateInput) {
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
    const updated = await prisma.product.updateMany({
      where: { id: productId, stock: { gte: quantity } },
      data: {
        stock: {
          decrement: quantity
        }
      }
    });

    if (updated.count === 0) {
      throw new ApiError('Estoque insuficiente', 409, 'INSUFFICIENT_STOCK');
    }

    return prisma.product.findUnique({ where: { id: productId } });
  }

  async getStock(productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true }
    });

    return product?.stock || 0;
  }
}
