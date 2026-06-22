import { NextRequest } from 'next/server';
import { ProductService } from '@/lib/product-service';
import { authenticateToken } from '@/lib/auth-middleware';
import {
  createdResponse,
  forbiddenResponse,
  handleApiError,
  successResponse,
} from '@/lib/api-helpers';
import { productCreateSchema, productQuerySchema } from '@/lib/validators';

const productService = new ProductService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = productQuerySchema.parse({
      skip: searchParams.get('skip') ?? undefined,
      take: searchParams.get('take') ?? undefined,
      categoryId: searchParams.get('categoryId') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      isActive: searchParams.get('isActive') ?? undefined,
      lowStock: searchParams.get('lowStock') ?? undefined,
      scope: searchParams.get('scope') ?? undefined,
    });

    const includeInactive = query.scope === 'admin';
    if (includeInactive) {
      const user = authenticateToken(request);
      if (user.role !== 'ADMIN') return forbiddenResponse();
    }

    const result = await productService.getProducts(query.skip, query.take, {
      categoryId: query.categoryId,
      search: query.search,
      isActive: query.isActive,
      lowStock: query.lowStock,
      includeInactive,
    });
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
