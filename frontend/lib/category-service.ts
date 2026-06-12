import { prisma } from './prisma';

export class CategoryService {
  async getCategories() {
    return prisma.category.findMany({
      include: { products: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getCategoryById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: { products: true }
    });
  }

  async createCategory(data: any) {
    return prisma.category.create({
      data,
      include: { products: true }
    });
  }

  async updateCategory(id: string, data: any) {
    return prisma.category.update({
      where: { id },
      data,
      include: { products: true }
    });
  }

  async deleteCategory(id: string) {
    return prisma.category.delete({
      where: { id }
    });
  }
}
