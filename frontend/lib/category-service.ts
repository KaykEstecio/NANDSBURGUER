import { prisma } from './prisma';
import { CategoryCreateInput, CategoryUpdateInput } from './validators';

export class CategoryService {
  async getCategories() {
    return prisma.category.findMany({
      include: { products: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCategoryById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
  }

  async createCategory(data: CategoryCreateInput) {
    return prisma.category.create({
      data,
      include: { products: true },
    });
  }

  async updateCategory(id: string, data: CategoryUpdateInput) {
    return prisma.category.update({
      where: { id },
      data,
      include: { products: true },
    });
  }

  async deleteCategory(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  }
}
