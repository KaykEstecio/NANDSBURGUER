import { prisma } from '../config/database';

interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
}

interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
}

export class ProductService {
  async getAll(skip = 0, take = 10) {
    return prisma.product.findMany({
      skip,
      take,
      include: {
        category: true
      }
    });
  }

  async getById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true
      }
    });
  }

  async create(input: CreateProductInput, userId: string) {
    return prisma.product.create({
      data: {
        ...input,
        createdById: userId
      },
      include: {
        category: true
      }
    });
  }

  async update(id: string, input: UpdateProductInput) {
    return prisma.product.update({
      where: { id },
      data: input,
      include: {
        category: true
      }
    });
  }

  async delete(id: string) {
    return prisma.product.delete({
      where: { id }
    });
  }

  async getStock(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { stock: true }
    });
    return product?.stock || 0;
  }

  async decreaseStock(id: string, quantity: number) {
    return prisma.product.update({
      where: { id },
      data: {
        stock: {
          decrement: quantity
        }
      }
    });
  }
}
