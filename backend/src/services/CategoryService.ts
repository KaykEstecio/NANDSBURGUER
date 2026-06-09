import { prisma } from '../config/database';

interface CreateCategoryInput {
  name: string;
  description?: string;
}

export class CategoryService {
  async getAll() {
    return prisma.category.findMany({
      include: {
        products: true
      }
    });
  }

  async getById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        products: true
      }
    });
  }

  async create(input: CreateCategoryInput) {
    return prisma.category.create({
      data: input
    });
  }

  async update(id: string, input: CreateCategoryInput) {
    return prisma.category.update({
      where: { id },
      data: input
    });
  }

  async delete(id: string) {
    return prisma.category.delete({
      where: { id }
    });
  }
}
