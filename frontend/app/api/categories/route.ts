import { NextRequest } from 'next/server';
import { CategoryService } from '@/lib/category-service';
import { authenticateToken } from '@/lib/auth-middleware';
import {
  createdResponse,
  forbiddenResponse,
  handleApiError,
  successResponse
} from '@/lib/api-helpers';
import { categoryCreateSchema } from '@/lib/validators';

const categoryService = new CategoryService();

export async function GET(request: NextRequest) {
  try {
    const categories = await categoryService.getCategories();
    return successResponse(categories);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = authenticateToken(request);
    
    if (user.role !== 'ADMIN') {
      return forbiddenResponse();
    }

    const data = categoryCreateSchema.parse(await request.json());
    const category = await categoryService.createCategory(data);
    
    return createdResponse(category);
  } catch (error) {
    return handleApiError(error);
  }
}
