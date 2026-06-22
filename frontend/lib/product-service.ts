import { Prisma } from '@prisma/client';
import { ApiError } from './api-helpers';
import { prisma } from './prisma';
import { ProductCreateInput, ProductUpdateInput } from './validators';

interface ProductFilters {
  categoryId?: string;
  search?: string;
  isActive?: boolean;
  lowStock?: boolean;
  includeInactive?: boolean;
}

export class ProductService {
  async getProducts(skip = 0, take = 10, filters: ProductFilters = {}) {
    const where: Prisma.ProductWhereInput = {};
    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }
    if (filters.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }
    if (filters.includeInactive) {
      if (filters.isActive !== undefined) where.isActive = filters.isActive;
    } else {
      where.isActive = true;
    }
    if (filters.lowStock) {
      where.stock = { lte: 10 };
    }

    const products = await prisma.product.findMany({
      where,
      skip,
      take,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.product.count({ where });

    return { products, total };
  }

  async getProductById(id: string, includeInactive = false) {
    return prisma.product.findFirst({
      where: { id, ...(includeInactive ? {} : { isActive: true }) },
      include: { category: true },
    });
  }

  async createProduct(data: ProductCreateInput, userId: string) {
    return prisma.product.create({
      data: {
        ...data,
        createdById: userId,
      },
      include: { category: true },
    });
  }

  async updateProduct(id: string, data: ProductUpdateInput) {
    return prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  async deleteProduct(id: string) {
    return prisma.product.update({
      where: { id },
      data: { isActive: false },
      include: { category: true },
    });
  }

  async decreaseStock(productId: string, quantity: number) {
    const updated = await prisma.product.updateMany({
      where: { id: productId, stock: { gte: quantity } },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });

    if (updated.count === 0) {
      throw new ApiError('Estoque insuficiente', 409, 'INSUFFICIENT_STOCK');
    }

    return prisma.product.findUnique({ where: { id: productId } });
  }

  async getStock(productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true },
    });

    return product?.stock || 0;
  }
}
