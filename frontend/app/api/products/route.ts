import { NextRequest } from 'next/server';
import { ProductService } from '@/lib/product-service';
import { authenticateToken } from '@/lib/auth-middleware';
import {
  createdResponse,
  forbiddenResponse,
  handleApiError,
  successResponse
} from '@/lib/api-helpers';
import { paginationQuerySchema, productCreateSchema } from '@/lib/validators';

const productService = new ProductService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = paginationQuerySchema.parse({
      skip: searchParams.get('skip') ?? undefined,
      take: searchParams.get('take') ?? undefined,
      categoryId: searchParams.get('categoryId') ?? undefined
    });

    const result = await productService.getProducts(query.skip, query.take, query.categoryId);
    return successResponse(result);
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

    const data = productCreateSchema.parse(await request.json());
    const product = await productService.createProduct(data, user.userId);
    
    return createdResponse(product);
  } catch (error) {
    return handleApiError(error);
  }
}
