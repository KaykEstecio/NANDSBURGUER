import { NextRequest } from 'next/server';
import { CategoryService } from '@/lib/category-service';
import { authenticateToken } from '@/lib/auth-middleware';
import {
  forbiddenResponse,
  handleApiError,
  notFoundResponse,
  successResponse,
} from '@/lib/api-helpers';
import { categoryUpdateSchema } from '@/lib/validators';

const categoryService = new CategoryService();

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const category = await categoryService.getCategoryById(id);

    if (!category) {
      return notFoundResponse('Categoria');
    }

    return successResponse(category);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const user = authenticateToken(request);

    if (user.role !== 'ADMIN') {
      return forbiddenResponse();
    }

    const data = categoryUpdateSchema.parse(await request.json());
    const category = await categoryService.updateCategory(id, data);

    return successResponse(category);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const user = authenticateToken(request);

    if (user.role !== 'ADMIN') {
      return forbiddenResponse();
    }

    const category = await categoryService.deleteCategory(id);

    return successResponse(category);
  } catch (error) {
    return handleApiError(error);
  }
}
